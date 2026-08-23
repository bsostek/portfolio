import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const MAX_QUESTIONS_PER_SESSION = 10;
const MAX_MESSAGE_LENGTH = 500;

const resumeContext = `
Name: Brian Sostek
Date of Birth: November 13, 2000
Location: Madison, Wisconsin, United States
Current Role: Software Developer at Epic Systems (since August 2023)
Born and raised in the Philadelphia area.
Currently looking for new jobs in the Northeast or Western United States

Summary:
Brian Sostek is a software developer focused on integrating Generative AI into healthcare software. At Epic, he works on the Lumens endoscopy application, building features powered by Large Language Models (LLMs) to improve clinical efficiency and user experience. His work includes designing AI tools to streamline documentation, enhance physician workflows, and support hospitals with limited resources. Brian combines strong technical skills in full-stack development with hands-on collaboration through clinical site observations and interdisciplinary teamwork.

Early Inspiration and Personal Background:
Brian’s journey into computer science began during his freshman year of high school at a club fair, where he discovered the Computer Club. Initially expecting to play video games, he instead watched in fascination as an Arduino was programmed and an LED light show came to life. From that day on, he became a regular member, learning C++ and Java, and by junior year, he was elected an officer. When senior year arrived, he was the last remaining officer and took on the responsibility of leading the club, revitalizing it with lessons and presentations such as “What is Blockchain?” and “The Importance of Cloud Computing.”
This experience solidified his interest in technology and inspired him to major in computer science at the University of Pittsburgh. During college, he remained active in computing organizations, attended multiple hackathons, and notably won the grand prize at **SteelHacks**, a hackathon with over 300 participants from Pitt, Carnegie Mellon, and Duquesne.

Experience:

- **Epic Systems** — Software Developer
  *Aug 2023 – Present, Verona, WI (On-site)*
  - Lead development of AI-driven features using LLMs for the Lumens endoscopy platform.
  - Conducted nationwide on-site visits to endoscopy units to gather workflow insights.
  - Improved clinical documentation and billing processes for hospitals and physicians.
  **Skills:** C#, TypeScript, React.js, Web Development, Software Infrastructure, LLM Integration

- **University of Pittsburgh** — Undergraduate Teaching Assistant
  *Aug 2021 – Jan 2023*
  - Taught Data Structures & Algorithms.
  - Led lab sessions and office hours to assist students with Java, OOP, and algorithm design.
  **Skills:** Java, Algorithms, Data Structures, Teaching, Mentoring

- **Epic Systems** — Software Developer Intern
  *May 2022 – Aug 2022, Madison, WI*
  - Built full-stack features using C#, TypeScript, and React to improve physician efficiency.
  - Enhanced enterprise-level codebases with user-behavior-based productivity features.
  **Skills:** JavaScript, C#, TypeScript, React.js

- **Serenno Medical** — Software Engineer Intern
  *Jun 2021 – Aug 2021, Yokneam, Israel*
  - Implemented an event logging system in C++ for Serenno’s Sentinel urine monitoring device.
  - Established a framework for the software team’s unit testing environment.
  **Skills:** C++, Embedded Systems, Startup Development

- **Lavner Camps & Programs** — Tech Team Member / Technology Instructor
  *Jun 2018 – Aug 2020, Spring House, PA*
  - Taught web and game design (Java, Python) to students aged 9–15.
  - Resolved IDE and compilation issues and helped campers win national coding tournaments.
  **Skills:** Java, Python, Web Development, Instruction

- **Chestnut Lake Camp** — General Staff
  *Jun 2019 – Aug 2019, Beach Lake, PA*

- **Everything Bagel Café** — Grill Cook
  *Aug 2015 – May 2019, North Wales, PA*
  - Prepared breakfast sandwiches and omelets in a fast-paced environment.

Education:
- **University of Pittsburgh**
  *B.S. in Computer Science, Aug 2019 – May 2023*
  GPA: 3.93, Summa Cum Laude, Honors
  Teaching Assistant, Sigma Alpha Mu, Pitt CS Club (Mentor), Chabad, Jazz Ensemble, Hillel
  **Relevant Coursework:** Data Structures, Algorithms, Systems Software, Artificial Intelligence, Databases

- **Wissahickon High School**
  *Graduated 2019*
  - Computer Club Officer, Section Leader (Jazz Band), Concert Master (Concert Band)

- **freeCodeCamp**
  *Full Stack Web Development Certification*

Awards:
- **1st Place – SteelHacks Hackathon (Feb 2020)**  [https://steelhacks.org/]
  University of Pittsburgh, among 300+ students from multiple universities including Carnegie Mellon and Duquesne.

Projects:
● “Self driving car” June 2022 [https://briansostek.github.io/self-driving-car/]
o Simulation of a car using machine learning and neural network to determine an algorithm to avoid other
obstacles
● “Yourdle” March 2022 [https://briansostek.github.io/yourdle/]
o Built a customizable Wordle-style game using React and a dictionary API; allowed dynamic word lengths
for an enhanced user challenge.
● “Country Comparison Game” March 2021
o Created a game using a Rest API to teach about the population and area of every country
● “Mad Cupid Games” February 2020
o Collaborated on a Valentine’s Day themed website containing several games in Unity and JS
● “Drink Dash” October 2019 [https://essebruce.github.io/Drink-Dash/]
o Weekend-long project that created a game to display the dangers of drinking for Games4SocialImpact
hackathon

Technical Skills:
- **Languages:** C#, JavaScript, TypeScript, Java, C++, Python
- **Frameworks:** React.js, .NET, Node.js
- **Databases:** MySQL, SQL Server
- **AI Tools:** Large Language Models (LLMs), Generative AI, OpenAI API, Gemini
- **Other:** Web Development, Software Infrastructure, Teaching, Mentoring, Research, Full-Stack Development.

Music and Creativity:
Outside of software, Brian is deeply passionate about music. His connection to it began at age five when a grand piano was wheeled into his family’s living room. He plays **saxophone, clarinet, piano, and most recently, guitar**, and enjoys experimenting with music production.
In high school, he was a section leader in the jazz band and concert master of the concert band, performing as a soloist for the **Third Movement of Mozart’s Clarinet Concerto**. He also led a small jazz combo that performed around his community at local events.
In college, he joined the University of Pittsburgh’s jazz ensemble as a freshman, took courses in small jazz performance and jazz history, and played in a band with friends, performing gigs around Pittsburgh. Music remains a creative outlet and a source of inspiration in his approach to problem solving and software design.

Top artists:
THE BEATLES
MORGAN WALLEN
RADIOHEAD
ZACH BRYAN
ALEX G
KANYE WEST
BOB DYLAN
BON IVER
BRUCE SPRINGSTEEN
REX ORANGE COUNTY
TAYLOR SWIFT
TYLER, THE CREATOR
PINEGROVE
CAR SEAT HEADREST
KENDRICK LAMAR
THE STROKES
ARCTIC MONKEYS
ALVVAYS
STEELY DAN
REMI WOLF
DANIEL CAESAR
SIMON & GARFUNKEL
VULFPECK
MAC MILLER
BEACH HOUSE
THE SMASHING PUMPKINS
FRANK SINATRA
TRAVIS SCOTT
FRANK OCEAN
BILLY JOEL
FLEET FOXES
DRAKE
DOMINIC FIKE
STEVE LACY
CAGE THE ELEPHANT
CLAIRO
LANA DEL REY
HIATUS KAIYOTE
SZA
STEVIE WONDER
FATHER JOHN MISTY
OASIS
MAC DEMARCO
ELLIOTT SMITH
TAME IMPALA
INDIGO DE SOUZA
MEN I TRUST
BOY PABLO
CIGARETTES AFTER SEX
PHOEBE BRIDGERS

Other interests:
Geography. Brian has memorized all countries and their world capitols and is learning their flags.
Philadelphia Eagles and Phillies. Brian is a life-long Philly sports fan. His favorite player on the Eagles is Devonta Smith, and Phillies was Ryan Howard
Travel. Brian has been to the following countries:
United States
Canada
Mexico
Jamaica
Colombia
Portugal
United Kingdom
Spain
France
Italy
Vatican City
Switzerland
Austria
Germany
Israel

And he's looking forward to going to more countries, especially in Eastern asia.
`;

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as { messages: ChatMessage[] };

  if (!messages?.length) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  if (userMessageCount > MAX_QUESTIONS_PER_SESSION) {
    return NextResponse.json(
      { error: "Question limit reached for this session." },
      { status: 429 }
    );
  }

  if (messages.some((m) => m.text.length > MAX_MESSAGE_LENGTH)) {
    return NextResponse.json(
      { error: `Messages must be under ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const currentDate = new Date();

  const systemInstruction = `
You are acting as Brian Sostek's personal assistant.
Use the context below to answer questions about him clearly and conversationally.
Answer in the first person, as your response will show as a speech bubble as if a direct quote from him.
Remember earlier turns in this conversation and stay consistent with what you've already said.

Context:
${resumeContext}

Current date:
${currentDate}
  `;

  const contents = messages.map((message) => ({
    role: message.role,
    parts: [{ text: message.text }],
  }));

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: { systemInstruction, maxOutputTokens: 400 },
  });

  const answer = response.text || "I’m sorry, I couldn’t answer that.";

  return NextResponse.json({ answer });
}
