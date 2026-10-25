import os
from typing import TypedDict, List

from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END


# --------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# --------------------------------------------------

load_dotenv()


# --------------------------------------------------
# LLM
# --------------------------------------------------

llm = ChatOpenAI(
    model="gpt-4.1-mini",
    temperature=0
)


# --------------------------------------------------
# FASTAPI APPLICATION
# --------------------------------------------------

app_api = FastAPI(
    title="AI Enterprise Operations Assistant",
    description="Conditional Multi-Agent Enterprise Support System",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app_api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# SHARED LANGGRAPH STATE
# --------------------------------------------------

class EnterpriseState(TypedDict):
    query: str
    category: str
    response: str
    chat_history: List[str]


# --------------------------------------------------
# REQUEST MODEL
# --------------------------------------------------

class ChatRequest(BaseModel):
    message: str
    chat_history: List[str] = []


# --------------------------------------------------
# ROUTER AGENT
# --------------------------------------------------

def router_agent(state):

    query = state["query"]

    prompt = f"""
    You are an Enterprise Operations Request Router.

    Classify the employee's request into ONLY ONE category:

    hr
    it
    finance
    sales
    procurement

    Category meanings:

    hr:
    Employee policies, leave, attendance, payroll-related
    HR questions, employee benefits, onboarding, workplace policies.

    it:
    Software, hardware, laptop, computer, network,
    internet, technical problems, passwords and IT support.

    finance:
    Expenses, reimbursements, invoices, billing,
    payments, financial requests and finance-related questions.

    sales:
    Customers, leads, sales opportunities, customer
    information and sales-related requests.

    procurement:
    Purchase requests, vendors, suppliers, purchasing,
    procurement processes and procurement assistance.

    Employee request:
    {query}

    Return ONLY the category name.
    """

    result = llm.invoke(prompt)

    category = result.content.strip().lower()

    return {
        "category": category
    }


# --------------------------------------------------
# HR AGENT
# --------------------------------------------------

def hr_agent(state):

    query = state["query"]
    history = state["chat_history"]

    prompt = f"""
    You are an HR Support Agent for an organization.

    Help employees with:

    - Employee policies
    - Leave and attendance
    - Employee benefits
    - Onboarding
    - Workplace policies
    - General HR questions
    - Employee support

    Previous conversation:
    {history}

    Current employee request:
    {query}

    Give a clear, simple and professional response.

    If the question requires access to confidential employee
    records or a company system that you cannot access,
    clearly explain that limitation instead of making up information.
    """

    result = llm.invoke(prompt)

    return {
        "response": result.content
    }


# --------------------------------------------------
# IT SUPPORT AGENT
# --------------------------------------------------

def it_agent(state):

    query = state["query"]
    history = state["chat_history"]

    prompt = f"""
    You are an IT Support Agent for an organization.

    Help employees with:

    - Software problems
    - Hardware problems
    - Laptop and computer issues
    - Network problems
    - Internet connectivity
    - Password and access issues
    - Technical support

    Previous conversation:
    {history}

    Current employee request:
    {query}

    Give a clear, simple and step-by-step response
    whenever troubleshooting is required.

    Do not claim that you have actually changed a password,
    accessed a computer, created a ticket, or modified a system
    unless such functionality is explicitly available.
    """

    result = llm.invoke(prompt)

    return {
        "response": result.content
    }


# --------------------------------------------------
# FINANCE AGENT
# --------------------------------------------------

def finance_agent(state):

    query = state["query"]
    history = state["chat_history"]

    prompt = f"""
    You are a Finance Support Agent for an organization.

    Help employees with:

    - Expense claims
    - Reimbursements
    - Invoices
    - Billing
    - Payments
    - Finance procedures
    - Financial questions

    Previous conversation:
    {history}

    Current employee request:
    {query}

    Give a clear, simple and professional response.

    If specific company financial records or policies are
    required but are not provided, do not invent them.
    """

    result = llm.invoke(prompt)

    return {
        "response": result.content
    }


# --------------------------------------------------
# SALES AGENT
# --------------------------------------------------

def sales_agent(state):

    query = state["query"]
    history = state["chat_history"]

    prompt = f"""
    You are a Sales Support Agent for an organization.

    Help employees with:

    - Customer-related questions
    - Leads
    - Sales opportunities
    - Customer information
    - Sales processes
    - General sales support

    Previous conversation:
    {history}

    Current employee request:
    {query}

    Give a clear, simple and professional response.

    Do not invent customer records, sales numbers,
    leads or CRM information that you cannot access.
    """

    result = llm.invoke(prompt)

    return {
        "response": result.content
    }


# --------------------------------------------------
# PROCUREMENT AGENT
# --------------------------------------------------

def procurement_agent(state):

    query = state["query"]
    history = state["chat_history"]

    prompt = f"""
    You are a Procurement Support Agent for an organization.

    Help employees with:

    - Purchase requests
    - Procurement procedures
    - Vendors
    - Suppliers
    - Purchase approvals
    - Purchasing-related questions

    Previous conversation:
    {history}

    Current employee request:
    {query}

    Give a clear, simple and professional response.

    If a specific vendor, purchase order or company
    procurement record is required but unavailable,
    do not invent information.
    """

    result = llm.invoke(prompt)

    return {
        "response": result.content
    }


# --------------------------------------------------
# CONDITIONAL ROUTING
# --------------------------------------------------

def choose_agent(state):

    category = state["category"]

    if "hr" in category:
        return "hr"

    elif "it" in category:
        return "it"

    elif "finance" in category:
        return "finance"

    elif "sales" in category:
        return "sales"

    else:
        return "procurement"


# --------------------------------------------------
# CREATE LANGGRAPH
# --------------------------------------------------

graph = StateGraph(EnterpriseState)


# Add nodes
graph.add_node("router", router_agent)

graph.add_node("hr", hr_agent)
graph.add_node("it", it_agent)
graph.add_node("finance", finance_agent)
graph.add_node("sales", sales_agent)
graph.add_node("procurement", procurement_agent)


# START → ROUTER
graph.add_edge(START, "router")


# Conditional routing
graph.add_conditional_edges(
    "router",
    choose_agent,
    {
        "hr": "hr",
        "it": "it",
        "finance": "finance",
        "sales": "sales",
        "procurement": "procurement"
    }
)


# Agents → END
graph.add_edge("hr", END)
graph.add_edge("it", END)
graph.add_edge("finance", END)
graph.add_edge("sales", END)
graph.add_edge("procurement", END)


# Compile
enterprise_app = graph.compile()


# --------------------------------------------------
# ROOT ENDPOINT
# --------------------------------------------------

@app_api.get("/")
def home():

    return {
        "message": "AI Enterprise Operations Assistant is running",
        "status": "success"
    }


# --------------------------------------------------
# CHAT ENDPOINT
# --------------------------------------------------

@app_api.post("/chat")
def chat(request: ChatRequest):

    query = request.message

    chat_history = request.chat_history


    # Run LangGraph
    result = enterprise_app.invoke({
        "query": query,
        "category": "",
        "response": "",
        "chat_history": chat_history
    })


    # Updated conversation history
    updated_history = chat_history.copy()

    updated_history.append(
        f"Employee: {query}"
    )

    updated_history.append(
        f"Assistant: {result['response']}"
    )


    return {
        "message": result["response"],
        "category": result["category"],
        "chat_history": updated_history
    }