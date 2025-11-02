import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import { EmbeddingService } from '../services/embeddingService';

// Utility function to convert markdown-style formatting to HTML
const formatMessageContent = (content: string): string => {
  return content
    // Bold text: **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text: *text* -> <em>text</em>
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code: `code` -> <code>code</code>
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
    // Line breaks
    .replace(/\n/g, '<br />');
};

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '👋 Welcome to **MortgageMate**! I\'m your AI mortgage consultant. I can help you:\n\n• **Analyze credit issues** and find suitable lenders\n• **Compare bank policies** and interest rates\n• **Recommend the best mortgage** for your situation\n\nWhat\'s your mortgage scenario today?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const AI_BASE_CONTEXT = `
Credit Report/File (C)
No credit file found?
  
No Enquiries – investigate why?
Does it make sense given their liabilities?
Example: If they have a credit card & there are no enquiries – doesn’t make sense.

Adverse Listings: Defaults, Judgments and discharged bankruptcies

When was it lodged?

Has it been paid/discharged?

Multiple enquiries

More than 2 enquiries in past 6 months at 95% LVR

More than 3 enquiries in last 6 months at 90% LVR or below is a credit issue

Lots of enquiries for small debts

Enquiries with non-conforming lenders / payday lenders

Enquiry with LMI providers – check where this app is going & look for ‘QBE’ or ‘Genworth’ in particular in the last 18 months

Already applied with a lender we will use.

Repayment History
Bank Statements (C)

Does it cover length of period required by the lender?

Must be less than 6 weeks old

Does the statement show salary credits for the applicant/s?

If not, obtain statement which has salary credits

Undisclosed Debts: Look for transfers to undisclosed credit cards & financial institutions

Signs of gambling – look for multiple ATM withdrawals in one day, especially at pubs/clubs

Centrelink payments

Child support payments

High expenditure

Name of undisclosed partners

Any personal transactions that say "loans"

Over-limit withdrawals

Quick withdrawals to zero balance

Loan Statements / Credit Card Statements (C)

Does it cover the required length?

Must be less than 6 weeks old

Missed repayments

Late repayments

No repayments

Constant redraws

Over limits

Cash advance

Links to other undisclosed accounts

Arrears – check for arrears fees

If going with the same lender – check that they have never missed a payment

Council Rates (C)

In arrears?

Same names on council rates as on application?

Another person on title not mentioned

Only husband or wife on title

Property in company/trust name

Sometimes land area/zoning is mentioned – check if it meets policy (anything other than residential zoning is a credit issue)

Genuine Savings (C)
Is genuine savings required?

Full doc loan above 85% LVR – need to evidence genuine savings

Full doc loan above 60% LVR – may need evidence of genuine savings

Rent as Genuine Savings

Applicant renting for 12 months at same place with a licensed real estate agent?

Private rent as genuine savings = credit issue

Past rental ledger shows perfect repayments?

Rental ledger under the same names as borrowers?

Other forms of Genuine Savings

Additional debt repayments as genuine savings

Inheritance or gift held for 3 months = genuine savings?

Ideal Genuine Savings

Must be in borrower’s name and in personal account

Ideally increasing with no lump sums over at least 3 months

Lump sums = any amount larger than applicant’s pay

Investigate all lump sum payments

If balance not increasing, check with lender

Amount Required

Is more than 5% of purchase price required?

Most lenders require 10% genuine savings for investment purposes.

Collateral
Security (C)
Location

Check lender’s postcode restriction policy

Inner City – check postcode & maximum LVR

Capital City location is best

Natural disaster effects: flood, fire, earthquake etc.

QLD flood-affected

Size

<50m² – check minimum size policy

Always check land size (>2ha = check policy)

10ha – LVR likely below 90%

Large, cheap land may be rural – check if within guidelines

Type of Property

Zoning – anything other than residential zoning = credit issue

High Density – QBE policy: higher than 4 levels & more than 30 units

Off the plan – check proposed settlement date

Title type – Torrens & Strata fine, anything else check

Service Apartment – check bank acceptability

Other

No agent involved = goes straight to LMI as outside DUA

Good condition / livable

Contract of Sale (C)

Rebates on contract of sale

Vendor same last name as purchaser?

Is contract signed and dated?

Purchase through Real Estate Agent?

If not, ask for explanation (e.g., private sale, family purchase)

Are all purchasers on COS the same as loan borrowers?

Valuations (If included) (C)

Is address correct (matches council rates/COS)?

Borrower name correct?

Negative comments in valuation?

Comparables within 15% of valuation and within 6 months?

Valuation less than 3 months old (from inspection date)?

Title details correct?

Any 3+ risk ratings or any 4/5 risk ratings?

Adverse features mentioned?

Property currently for sale?

Property in bad condition / incomplete?

Commercial use mentioned?

Capital
LVR (C)

At 90% or 95% LVR – check lender’s maximum loan limits

Verify max LVR under your loan scenario

Does maximum LVR include LMI?

What LVR including LMI is acceptable?

Funds to Complete (C)

Funding position completed?

All fees, grants, stamp duties included?

Is LMI required & included?

Is LMI capped or inclusive?

Are debts being paid out included?

Asset Position (C)

A&L complete with supporting documents

Positive asset position

Less than 5% unsecured debts below 85% LVR = credit issue

Borrower’s net assets match Age & Income?

Capacity
Type and Length of Employment (C)

Less than 12 months – check with lender

Employment history – gaps, same industry?

Probation period

Casual employment / 2nd job / family employment

Self-employed:

Full Doc – Tax Returns & NOA

Low Doc – Low Doc Training

Contractor – Self-Employed Training

Income (C)

Any income aside from base = credit issue (check with lender)

Overtime, Allowances, Bonus/Commissions – check % & evidence

Unknown deductions

HECS/HELP

Voluntary Superannuation – provide evidence

Pay Slips (C)

Most recent & consecutive

Show name, employer, ABN, pay date, YTD, computerized

3 months YTD – else group certificate

No Annual Leave – borrower may be casual/contractor

Fraud indicators

Deductions / Salary sacrifice

HECS/HELP considered in servicing

Letter/Contract of Employment (C)

On letterhead, ABN, contact details, signed & dated

Includes start date, status, salary, full-time/casual

Typed and professional

Centrelink Statements (C)

All pages provided

FTB A & B: declared income matches?

Check lender’s max acceptable child age

Other Centrelink incomes – check lender acceptance

Group Certificate (C)

Date payments received

TFN removed

Most recent available?

Income matches YTD from payslips? Explain discrepancies.

Tax Returns & Notices of Assessment (C)

Two most recent tax returns

Include company/partnership if applicable

Include NOA

Financial statements for companies

TFNs removed

Avoid double dipping company income

Watch for forged NOAs (barcodes can be scanned)

Draft returns – flag

Explain assessable income

Match income with applications/calculators

If income changed >20% – check lender guidelines

Decline in income – check policy

Any tax debts?

Add notes on assessable income determination

Servicing Calculator (C)

Correct assessment rate

Watch for unit mismatches (monthly vs annual)

Income consistency

Meets serviceability?

LMI calculator completed if required

Add notional rent if rent-free with parents

All debts/expenses match application

Loan amount includes LMI if capped

Rent reliance <50%

Using non-base income? Follow policy

NSR/DSR thresholds checked

Conditions / Common Sense
DUA & LMI (C)

Loan > $1m – call BDM

Outside DUA = LMI policy applies

Developer/no agent = outside DUA

Confirm lender DUA policy

Purpose (C)

Non-purchase owner-occupied

Construction:

All docs included?

Customer aware this is final contract?

Funds to complete checked?

One or two applications required?

Cash Out:

Reason & evidence for >$50K

Lender acceptance

Lender

Existing customer? Check history

Clawback under 2 years

Check if pre-approval is genuine or system-generated

Requested Loan Product

Check for minimum loan size

Requested Repayments

Interest-only: check lender policy

Existing OFI account for repayments – check acceptance

Other
Borrower’s Age (C)

Over 45 or under 20 = credit issue

Check retirement age vs loan term

Provide exit strategy if needed

Superannuation matches income/life stage

Credit Score (C)

Higher LVR = harsher scoring

2 enquiries in 6 months

No defaults

Check for missed payments with known lenders

High-risk professions flagged

Address history

Assets complete? Furniture, Car, Super, etc.

Balances < credit limits

Contact numbers for all applicants

Cheque account included (CBA scores lower without it)

Trust (C)

Hybrid?

Allowed to borrow funds for investment?

Directors, beneficiaries, appointer verified

Does lender require beneficiary as borrower?

Low Doc (C)

No GST registration – max income ~$70K

Some lenders require GST even < $75K

Business has no defaults

ABN registered for required time

Normal securities only

BAS assessment per lender (40%, 50%, specific rule)

Builder/Developer restrictions

<50sqm or >2ha = issue

Cash out = red alert

Low Doc declaration complete

Location, land, and property type acceptable

Co-borrowers with PAYG – provide full income evidence

Is declared income sufficient?

No Doc = unregulated loan?

ABN GST registered if required

Guarantor (C)

Loan purpose = investment = credit issue

Retired/pension guarantor

Max guarantee per lender

Family guarantor requires income evidence

Lender accepts second mortgage?

Guarantor asset base = exit plan

Guarantor immediate family?

Non-Resident (C)

Visa type

Foreign investor – check country acceptability

FIRB approval

One borrower Aus citizen, one not? Check lender policy.
    `;

    const AI_BASE_POLICIES = `
    ** Banks ** 
    Bankwest, CBA, La Trobe, Qudos 
     *** Bonus Income ***
        - Bankwest: Take bonus income from the most recent financial year.
        - Qudos, CBA and La Trobe: Take bonus income for 2 recent years in following policy:
          If the most recent year bonus income is lower than previous years bonus income take the most recent bonus income.
          Else take an average of 2 financial years of bonus income.

    *** Bad Credit *** 
    If the equitax below 600 or default rate is 5000 it is classified as bad credit.
      - La Trobe: Can assist with bad credit but will verify product with BDM.
      - All other banks can't assist with bad credit.   

    *** Self Employed Income Verification *** 
      - Bankwest: Takes income from most recent financial year
      - Qudos, CBA and La Trobe:
      - Take income from most recent 2 financial years. 
        If the most recent year's income is lower than previous years income take the most recent income.
        Else take either an average of 2 financial years of income or 120% of previous years income, whichever is lower.


    *** LMI Waiver *** 
       - As long the LVR is within 80% or less no LMI is charged.
       - La Trobe and Qudos do not have LMI waiver if the LVR is over 80% regardless of the profession.
       - Bankwest waives LMI for doctors as long as the LVR is below 90%.
       - CBA waives LMI for professionals in following professions: Doctors, Accountants, Lawyers as long as the LVR is below 90%.


    *** Interest Rate ***

        Qudos: 
        LVR:                       Owner occupiers Interest Rate  Investment interst Rate
        ---------------------------------------------------------------------------------        
        Less than or equal to 80%      5.29                         5.49
        Less than or equal to 70%      5.29                         5.39
        Less than or equal to 60%      5.19                         5.29


        Bankwest:
        LVR:                       Owner occupiers Interest Rate  Investment interst Rate
        ---------------------------------------------------------------------------------        
        Less than or equal to 80%      5.49                         5.74
        Less than or equal to 70%      5.49                         5.74
        Less than or equal to 60%      5.44                         5.69

        CBA:
        LVR:                       Owner occupiers Interest Rate  Investment interst Rate
        ---------------------------------------------------------------------------------        
        Less than or equal to 80%      5.74                         5.94
        Less than or equal to 70%      5.64                         5.84
        Less than or equal to 60%      5.59                         5.79

        La Trobe:
        LVR:                       Owner occupiers Interest Rate  Investment interst Rate
        ---------------------------------------------------------------------------------        
        Less than or equal to 80%      6.29                         6.49
        Less than or equal to 70%      6.24                         6.39
        Less than or equal to 60%      6.09                         6.24


    ** General Instructions **
    Here is the order you should consider while selecting the best bank:
    - highest accessible income
    - lowest LMI rate
    - lowest interest rate
    Example: 
      Even if Bankwest provides lower interest rate but has high accessible income, you should prefer bankwest. 
    `;

    try {
      const response = await EmbeddingService.generateChatResponse(inputMessage, AI_BASE_CONTEXT, AI_BASE_POLICIES);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200/50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AI Mortgage Consultant</h2>
                <p className="text-sm text-gray-500">Get personalized mortgage recommendations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>AI Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-purple-200/50 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Credit Analysis</h3>
                </div>
                <p className="text-sm text-gray-600">Analyze your credit profile and find suitable lenders</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-purple-200/50 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Policy Comparison</h3>
                </div>
                <p className="text-sm text-gray-600">Compare rates and policies across multiple banks</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-purple-200/50 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Smart Recommendations</h3>
                </div>
                <p className="text-sm text-gray-600">Get AI-powered mortgage recommendations</p>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-4 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-2xl px-6 py-4 rounded-2xl shadow-lg ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white ml-12'
                    : 'bg-white/90 backdrop-blur-sm text-gray-900 border border-purple-200/50'
                }`}
              >
                <div
                  className={`text-sm leading-relaxed ${
                    message.sender === 'user' ? 'text-white' : 'text-gray-800'
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                />
                <p className={`text-xs mt-3 ${
                  message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {message.sender === 'user' && (
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-4 justify-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white/90 backdrop-blur-sm text-gray-900 border border-purple-200/50 px-6 py-4 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 ml-2">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-purple-200/50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your mortgage situation... (e.g., 'I have a 650 credit score and need a $500k loan')"
                className="w-full min-h-[56px] max-h-32 px-4 py-3 pr-12 bg-white/90 backdrop-blur-sm border border-purple-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none shadow-lg placeholder-gray-500"
                rows={1}
                disabled={isLoading}
              />
              <div className="absolute right-3 top-3 text-gray-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-gray-500">
            <span>✨ Powered by AI</span>
            <span>•</span>
            <span>🔒 Secure & Private</span>
            <span>•</span>
            <span>⚡ Instant Analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
}