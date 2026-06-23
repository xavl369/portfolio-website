(function () {
  const OPENAI_API_KEY = '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';
  const MODEL = 'gpt-4o-mini';
  const MAX_HISTORY_TURNS = 10;

  const SYSTEM_PROMPT = `You are an AI assistant for Abraham Saúl Sandoval Meneses's portfolio website. Your role is to answer questions about Abraham's professional background, skills, experience, and projects. Be concise, friendly, and professional. Respond in the same language the user writes in (Spanish or English). Keep responses under 3 short paragraphs.

If asked about something unrelated to Abraham's professional profile, politely redirect the conversation.

## About Abraham
Full-Stack Developer with 10+ years of experience in software development, machine learning, automation, systems integration, and AI-powered applications. Based in Hermosillo, Sonora, México. Available for remote work worldwide and open to Full-Time & Freelance opportunities. Contact: abrahams.sandovalm@gmail.com | Phone: (662) 4 44 10 38 | LinkedIn: linkedin.com/in/abraham-saúl-sandoval-meneses-8465bb107 | GitHub: github.com/xavl369

## Education
- Bachelor of Computer Science — University of Sonora. Specialized in AI. Graduated with outstanding performance on the EGEL-COMPU national exam. Cédula Profesional: 15719812 (SEP, México).
- Languages: Spanish (native), English (advanced)

## Skills
- Languages & Frameworks: C#, Python, TypeScript, SQL, .NET Core, Angular, React
- Cloud & DevOps: AWS, Azure, Docker, Azure DevOps, AWS Lambda, Git
- Databases: SQL Server, PostgreSQL, DynamoDB, SAP HANA, MySQL
- AI & Integrations: OpenAI API, AWS Bedrock, Claude, UiPath RPA, SignalR, Twilio, SAP Business One
- AI-Assisted Development: Claude Code, Codex, GitHub Copilot
- Core Practices: Full-Stack Development, Systems Integration, Machine Learning & NLP, Clean Architecture, Microservices, Robotic Process Automation

## Work Experience (10 roles, most recent first)
1. **Software Engineer** — PhoenixCare (Remote, Part-Time) | Mar 2026 – Present
   Voice call workflows, speech-to-text and AI-powered conversation analysis using LLMs, serverless architecture with AWS Lambda and Fastify. Stack: React, TypeScript, AWS Bedrock, PostgreSQL, DynamoDB, Twilio, Docker.

2. **Full-Stack Developer Consultant** — Excelia – Grupo CARSO (Remote) | Apr 2024 – Apr 2026
   Built SigOps from scratch — an enterprise project management system with Microsoft Dynamics 365 integration, database design, clean architecture guidance, and code reviews. Stack: C#, TypeScript, .NET Core 9, React 18, SQL Server, Azure DevOps.

3. **Full-Stack Developer & AI Engineer** — Trialshub (Remote, Part-Time) | Feb 2024 – May 2025
   Built features for a clinical trial recruitment platform with AI-assisted patient-trial matching. Developed an embeddable React chatbot widget deployed across multiple client sites. Built recruiter training simulations and voice workflows with Twilio. Stack: Next.js, React, TypeScript, OpenAI API, LangChain, Pinecone, Twilio, PostgreSQL, Supabase, AWS.

4. **Full-Stack Developer & Mentor** — Pinnacle Aerospace – Genety (Hybrid) | Feb 2023 – Feb 2024
   Microservices feature development, real-time collaboration with SignalR, QA bug resolution, mentoring. Stack: C#, TypeScript, .NET Core 7, Angular 17, PostgreSQL, Docker.

5. **Full-Stack Developer** — Pinnacle Aerospace – CampusCE (Remote) | Nov 2020 – Feb 2023
   Multi-tenant continuous education platform — student, instructor, admin portals, payment integrations. Stack: C#, Python, .NET, SQL Server, SSIS, Twilio, Azure.

6. **Full-Stack Developer & ML Engineer** — Intersel (Remote) | Nov 2019 – Nov 2020
   Level 3 virtual assistant / chatbot development, NLP research, integration with web chats, social media, and omnichannel platforms (Zendesk, Salesforce, CONVERSA). Stack: Python, C#, spaCy, TensorFlow, Rasa, .NET Core, AWS, UiPath.

7. **Full-Stack Developer & SAP B1 Developer** — Qualisys (On-site) | Feb 2018 – Nov 2019
   SAP Business One automation, add-ons, electronic billing, web portals with SAP B1 integration. Stack: C#, Angular, TypeScript, SQL Server, SAP HANA, UiPath.

8. **Full-Stack Developer** — EDI Service (On-site) | Jun 2016 – Feb 2018
   EDI document parsing and generation, integration with Amazon, BestBuy, Walmart, web portal development. Stack: C#, SQL Server, AngularJS, .NET Framework, AWS.

9. **IT Leader** — NPC Group – GE Appliances (On-site) | Apr 2015 – Jun 2016
   Web and iOS development, Excel automation with VBA, sales estimation using regression models. Stack: PHP, JS, Objective-C, MySQL, CodeIgniter.

10. **Intern Software Developer** — IENova – Sempra Energy (On-site) | Oct 2014 – Apr 2015
    Intranet and iOS app for Occupational Health & Safety, Excel automation. Stack: JS, HTML, CSS, Objective-C, VBA.

## Key Projects
- **SigOps (Grupo CARSO):** Enterprise project management system built from scratch with Dynamics 365 integration. Stack: C#, .NET Core 9, React 18, TypeScript, SQL Server.
- **CampusCE:** Multi-tenant continuous education platform with student/instructor/admin portals and payment processor integrations. Stack: C#, .NET, Python, SQL Server, Twilio, Azure.
- **Virtual AI Assistant:** Level 3 conversational assistant integrated with Zendesk, Salesforce, and CONVERSA omnichannel. Supports human agent handoff. Stack: Python, C#, spaCy, TensorFlow, Rasa, AWS, UiPath.
- **Requisitions Portal:** Portal with SAP Business One integration. Stack: C#, Angular, SAP B1if, SQL Server.
- **Stock Operations Portal:** Inventory portal integrated with SAP B1. Stack: C#, AngularJS, SQL Server.
- **Working Hours Portal:** Employee time tracking across projects with RDLC reporting. Stack: C#, AngularJS, SQL Server.
- **Procore – SAP Business One Integration:** Project management tool integrated with SAP B1 via SDK and REST. Stack: C#, SAP B1 SDK, REST.
- **Bitrix24 – SAP Business One Integration:** CRM integrated with SAP B1 via SDK and REST. Stack: C#, SAP B1 SDK, REST.

## Certifications
- AWS Essential Training for Developers (LinkedIn Learning)
- Design Patterns in C# and .NET (Udemy)
- Parallel Programming with C# and .NET (Udemy)
- Modern Natural Language Processing in Python (Udemy)
- TensorFlow 2.0 Practical Advanced (Udemy)
- Building Chatbots in Python (DataCamp)
- Design Patterns in Python (Udemy)
- Integration Framework for SAP Business One (SAP openSAP)`;

  let conversationHistory = [];
  let isOpen = false;
  let isLoading = false;

  function createWidget() {
    const btn = document.createElement('button');
    btn.id = 'chat-widget-btn';
    btn.setAttribute('aria-label', 'Open chat');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';

    const panel = document.createElement('div');
    panel.id = 'chat-panel';
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML = `
      <div id="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar">AS</div>
          <div>
            <div class="chat-name">Abraham's Assistant</div>
            <div class="chat-status">Ask me about his experience</div>
          </div>
        </div>
        <button id="chat-close-btn" aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div id="chat-messages" role="log" aria-live="polite"></div>
      <div id="chat-input-wrap">
        <input id="chat-input" type="text" placeholder="Ask about Abraham's experience..." maxlength="500" autocomplete="off" />
        <button id="chat-send-btn" aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>`;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    btn.addEventListener('click', togglePanel);
    panel.querySelector('#chat-close-btn').addEventListener('click', closePanel);
    panel.querySelector('#chat-send-btn').addEventListener('click', sendMessage);
    panel.querySelector('#chat-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    appendMessage('bot', "Hi! I'm Abraham's AI assistant. Ask me anything about his skills, experience, or projects.");
  }

  function togglePanel() {
    isOpen ? closePanel() : openPanel();
  }

  function openPanel() {
    isOpen = true;
    document.getElementById('chat-panel').classList.add('chat-open');
    document.getElementById('chat-panel').setAttribute('aria-hidden', 'false');
    document.getElementById('chat-widget-btn').classList.add('chat-btn-active');
    setTimeout(function () { document.getElementById('chat-input').focus(); }, 300);
  }

  function closePanel() {
    isOpen = false;
    document.getElementById('chat-panel').classList.remove('chat-open');
    document.getElementById('chat-panel').setAttribute('aria-hidden', 'true');
    document.getElementById('chat-widget-btn').classList.remove('chat-btn-active');
  }

  function appendMessage(role, text) {
    var messages = document.getElementById('chat-messages');
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble-' + role;
    var content = document.createElement('span');
    content.textContent = text;
    bubble.appendChild(content);
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTypingIndicator() {
    var messages = document.getElementById('chat-messages');
    var indicator = document.createElement('div');
    indicator.className = 'chat-bubble chat-bubble-bot chat-typing';
    indicator.id = 'chat-typing-indicator';
    indicator.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    messages.appendChild(indicator);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTypingIndicator() {
    var el = document.getElementById('chat-typing-indicator');
    if (el) el.remove();
  }

  function setInputDisabled(disabled) {
    document.getElementById('chat-input').disabled = disabled;
    document.getElementById('chat-send-btn').disabled = disabled;
  }

  async function sendMessage() {
    if (isLoading) return;
    var input = document.getElementById('chat-input');
    var text = input.value.trim();
    if (!text) return;

    input.value = '';
    appendMessage('user', text);

    conversationHistory.push({ role: 'user', content: text });
    if (conversationHistory.length > MAX_HISTORY_TURNS * 2) {
      conversationHistory = conversationHistory.slice(-MAX_HISTORY_TURNS * 2);
    }

    isLoading = true;
    setInputDisabled(true);
    showTypingIndicator();

    try {
      var response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + OPENAI_API_KEY
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }].concat(conversationHistory),
          max_tokens: 350,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('API error ' + response.status);
      }

      var data = await response.json();
      var reply = data.choices[0].message.content.trim();
      conversationHistory.push({ role: 'assistant', content: reply });
      removeTypingIndicator();
      appendMessage('bot', reply);
    } catch (err) {
      removeTypingIndicator();
      appendMessage('bot', 'Sorry, something went wrong. Please try again or contact Abraham directly at abrahams.sandovalm@gmail.com.');
      console.error('Chatbot error:', err);
    } finally {
      isLoading = false;
      setInputDisabled(false);
      document.getElementById('chat-input').focus();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
