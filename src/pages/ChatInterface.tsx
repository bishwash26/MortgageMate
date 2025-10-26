import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { BankService } from '../services/bankService';
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
      content: 'Hello! I\'m your bank policy assistant. Ask me anything about our policies and I\'ll help you find the information you need.',
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
To prepare your documents for an LLM (Large Language Model) or a RAG (Retrieval-Augmented Generation) system, the best approach is to consolidate the tabular and free-form text into a single, highly structured, and citation-rich text document. This preserves all the core data while making it easily ingestible and searchable.

Below is the consolidated text, categorized by policy area, that includes all specific lender details, best-fit scores, and general rules.

Consolidated Multi-Lender Policy Document
I. General Policy Rules (Applicable to All Lenders)
These points cover core requirements that are generally consistent across all four lenders.


Documentation: All four require KYC/VOI (Verification of Identity), payslips/YTD statements, bank statements, contract/valuation (for purchase), and CCR (Comprehensive Credit Reporting) checks.


Self-Employed Documentation: Self-employed applicants generally need 1–2 years tax returns or accountant Financial Statements (FS), depending on the specific lender's rules.

LVR/LMI: Standard owner-occupied LVR is up to 95% with LMI (Lender's Mortgage Insurance); LVR tiers materially affect pricing and product eligibility.


Servicing: Lenders apply assessment rates and buffers to calculate serviceability.

Security & Postcode: All use postcode/security screens. Apartments/high-density and specific postcodes may attract lower LVR caps.

Construction/OTP: Accepted by all with progressive draws. Fixed-price contracts are preferred and typically have tighter LVRs.


Non-Residents & Overseas Income: Considered but restricted—requiring lower LVRs, extra verification, and specific rate/product overlays.

II. Multi-Lender Policy Comparison Table
Policy Niche	CBA (Commonwealth Bank)	Westpac Group	NAB (National Australia Bank)	ANZ (Australia & NZ Bank)	Best Score
Income (PAYG)	
Payslips, YTD, bank stmts; probation accepted; MLE capture per CBA rules #828838 

Payslips, YTD; CCR used; probation accepted 

Payslips, YTD; flexible assessor guidance [#NAB-220724] 

3m YTD payslip usually; HLC tooling for consistency [#ANZ-HLC-070425] 

ANZ 

Self-Employed	
Generally 2 yrs tax; some 1yr accountant FS allowed 

2 yrs tax standard; 1 yr case-by-case 

1 yr accountant FS + management info possible (NAB flexible) [#NAB-130824] 

Company wage rules clear; 18 months ABN + payslip guidance [#ANZ-LenderUpdate-120424] 

NAB / ANZ 

Servicing & Buffers	
CBA assessment rates, HEM comparisons [#CBA-doc] 

Assessment buffers + HEM; CCR influences debt capture 

Published assessment rates and tables; HEM used [#NAB-220724] 

HLC calculates UMI, applies floors/shading (strong tooling) [#ANZ-HLC-070425] 

ANZ 

Credit History	
CCR used; recent adverse history impactful 

CCR used; emphasis on last 12 months conduct 

CCR used; important for refinance/switch [#NAB-091123] 

CCR used; leveraged for Simpler Switch & assessments 

CBA / Westpac 

LMI Waivers	
Concessions for some professions (product dependent) 

Concessions for selected professionals (check criteria) 

Profession & product dependent; portal notes advise 

Explicit waivers for medicos, lawyers, accountants (well documented) [#ANZ-WhyChoose-271124] 

ANZ 

Refinance & Cashout	
Refi accepted with conduct evidence; cashout purpose checked 

Refi OK; cashout verification for large amounts 

Cashout >$100k or LVR>90% needs documentary evidence of use [#NAB-LoanPurpose-010125] 

Simpler Switch & refi pathways; CCR used for switch [#ANZ-WhyChoose-271124] 

NAB / ANZ 

Overseas Income	
Accepted with conversion & verification; shading applied 

Accepted with conversion & extra documentation 

Overseas borrower rules; conversion & verification required [#NAB-081123] 

HLC captures overseas income; net conversion guidance [#ANZ-HLC-070425] 

ANZ 

SLA (Broker/Clean File)	
1–7 business days for clean PAYG; longer for complex/foreign/selfemployed 

1–7 business days for simple PAYG; fasttrack for very clean files 

1–5 business days for clean PAYG via broker portal; longer for complex/foreign/rural 

1–5 business days for clean PAYG; longer for complex/selfemployed 


N/A
III. Variable Income Policy Comparison
Variable Feature	CBA	Westpac Group	NAB	ANZ	Consolidated Rule
Bonus Income	
Accepted when regular and evidenced (payslips/YTD/ATO) 

Accepted with evidence; ongoing/regular required 

Accepted if evidenced; usually 2 years for annual bonuses 

Accepts where evidenced and ongoing 

Requires regularity evidence (12–24 months) 

Overtime Income	
Accepted when regular; 6–12 months evidence; 100% for eligible medicos/emergency frontline with employer evidence 

Accepted; regular OT often accepted with 6+ months evidence; 100% possible for emergency services (conditions apply) 

Accepted; verify with ~6 months salary credits/payslips for OT/casual 

Accepted where regular; verify via YTD/payslips 

100% may be allowed for eligible frontline/medical roles, but YTD history is mandatory 

Shading / % Used	
Commonly ~80%; 100% for verified eligible frontline/medical roles 

Typically ~80%; 100% for specific emergency/frontline roles when evidenced 

System and policy commonly apply ~80% (20% shading); some foreign cases receive higher shading 

Common practice: use ~80% for variable income (20% shading) 

Typically ~80% used when assessing serviceability 

IV. ANZ-Specific Detailed Policy Summary
The ANZ Policy document covers credit assessment guidelines, loan structure requirements, and evidence standards for residential mortgage lending.

Income Verification 


PAYG Income: Requires two recent consecutive payslips showing employer name, gross income, and YTD figure. Casual employment must be ongoing for at least 6 months. Bonus, commission, and overtime are considered only if consistent over 6–12 months.




Self-Employed Income: Requires a minimum of 2 years of tax returns and financials (individual and business). Income is averaged across two years, or the latest year is used if justified. Acceptable add-backs include non-recurring expenses, depreciation, and interest on loans being refinanced.




Rental Income: 80% of gross rental income is accepted for serviceability, supported by a signed lease or rental appraisal.


Serviceability: Assessment rate is 3% above the actual interest rate or a minimum floor rate (currently around 8%).

Loan Structure and Risk 




Loan Purposes: Supports owner-occupied/investment purchases, refinances, debt consolidation, construction, and bridging loans.


Equity release above $100,000 requires a declared purpose and evidence.


LVR/LMI: Maximum LVR is 95% (including LMI). Genuine savings of at least 5% of the purchase price are required for high-LVR loans.



Credit Assessment: DTI (Debt-to-Income) ratio should generally not exceed 7x gross income. Credit history must be clear of unpaid defaults or bankruptcy.



Special Scenarios: Temporary residents are limited to 80% LVR. Guarantor loans are limited to immediate family.


Process and Documentation 




Construction: Loans are released in stages (slab, frame, lock-up, fixing, completion), with a valuer confirming stage completion before each drawdown.



Supporting Documents: Requires VOI, 90-day bank statements, tax returns, contracts of sale, and existing loan statements.

SLA: New Application: 1 Business Day; Additional Docs: 2 Business Days.


Exceptions: Allowed under strong mitigating circumstances (e.g., high assets, long-term ANZ relationship) and require a written rationale and credit manager approval.

V. Broker Tips and Gotchas

Documentation: Always attach YTD payslips, 3 months OFI salary credits, PAYG/NOA or ATO statements, and an employer letter confirming the ongoing nature of variable income.


Excluded Income: Higher duties and one-off payments are typically excluded as ongoing income unless they are made permanent.


Referrals: Foreign income and variable pay with a short history often require extra lender referral; price conservatively and allow more SLA time.

NAB: Watch NAB-specific rural/hectare rules and foreign-income sensitisations. Use broker portal tools as the system auto-shades uncertain income.


ANZ: Use ANZ calculator tools to allocate income-over-base; document why income is ongoing to avoid referral.


Westpac: Keep clear diary notes when using non-base income and confirm it is not temporary.`

    try {
      
      const prevUserMessage = messages.filter(message => message.sender == 'user').map(m => m.content).join('\n');
      const response = await EmbeddingService.generateChatResponse(inputMessage, AI_BASE_CONTEXT, prevUserMessage);
      
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
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-2xl px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}
              >
                <div
                  className="text-sm whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                />
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {message.sender === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white text-gray-900 shadow-sm px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question about bank policies..."
              className="flex-1 min-h-[44px] max-h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}