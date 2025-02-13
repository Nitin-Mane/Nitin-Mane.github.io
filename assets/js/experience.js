AOS.init();

//  Work experience cards

const experiencecards = document.querySelector(".experience-cards");
const exp = [
  {
  title: "Infinity Tech Resources",
  cardImage: "assets/images/experience-page/infinity_tech.png",
  place: "Aurangabad, Maharashtra, India",
  time: "Full-time · 3 yrs 6 mos",
  desp: "<h2>Senior Software Engineer</h2><br><strong>Key Responsibilities:</strong><ul><li>Collaborate with cross-functional teams to design and develop software applications that meet project requirements and deliver exceptional user experiences.</li><li>Utilize your expertise in machine learning, deep learning, and robotics to develop intelligent systems and algorithms that drive innovation and enhance product capabilities.</li><li>Apply agile development methodologies to deliver high-quality software solutions within established timelines.</li><li>Conduct thorough testing and debugging to ensure the reliability, performance, and security of developed software applications.</li><li>Stay updated with the latest industry trends and technologies in software development, machine learning, deep learning, and robotics, and apply them to drive continuous improvement.</li><li>Proficiency in programming languages such as Python, Java, C++, or others.</li><li>Strong problem-solving skills and ability to analyze complex technical challenges.</li></ul>",
  },
  {
  title: "Project Engineer",
  cardImage: "assets/images/experience-page/infinity_tech.png",
  place: "Aurangabad, Maharashtra, India",
  time: "Jan 2020 - Feb 2023 · 3 yrs 2 mos",
  desp: "<li>Project work on the electronics, robotics, and mechatronics stream</li><li>Develop and manage a detailed project schedule and work plan</li><li>Utilize industry best practices, techniques, and standards throughout the entire project execution</li><li>Measure project performance to identify areas for improvement</li><li>Work on professional academic and industrial research and patents.</li>",
  },
  {
  title: "The Sparks Foundation",
  cardImage: "assets/images/experience-page/sparkfoundation.png",
  place: "Singapore (Remote)",
  time: "Jun 2022 - Present · 1 yr 1 mo",
  desp: "<h2>Computer Vision and IoT</h2><li>Computer Vision<ul><li>Developing custom image processing algorithms and software</li><li>Creating applications for facial and emotion recognition, automated optical inspection, etc.</li><li>Developing advanced vision algorithms and applications for machine automation and visual inspection</li></ul></li><li>Internet of Things<ul><li>Academic exposure of Raspberry Pi, Nvidia Jetson, & microcontrollers</li><li>Developing software for IoT, Artificial Intelligence, and Machine Learning applications</li><li>Direct research on emerging trends, solutions, and standards in Automation and IoT/Industry 4.0</li></ul></li>",
  },
  {
  title: "MATLAB Helper",
  cardImage: "assets/images/experience-page/MATLABHelper_Trans_Rect.png",
  place: "Jaipur, Rajasthan",
  time: "4 yrs 6 mos",
  desp: "<h2>MATLAB Developer</h2><br>As a MATLAB Helper Developer, my main role is to assist clients in utilizing the MATLAB programming platform for various image processing, machine learning, microcontroller interface, and IoT projects. This includes providing guidance on the use of MATLAB's built-in functions and toolboxes, as well as developing custom scripts and functions to meet the specific needs of each project. One of my main responsibilities is to help clients implement image processing algorithms in MATLAB, such as image enhancement, segmentation, and feature extraction. I also assist clients in building machine learning models using MATLAB's built-in functions and toolboxes, and provide guidance on model selection, training, and evaluation. Another important aspect of my role is to assist clients with the interface between MATLAB and microcontrollers, such as Arduino and Raspberry Pi, to enable the integration of MATLAB code into embedded systems. I also help clients with the implementation of IoT projects using MATLAB, including data acquisition and analysis, and the development of web-based graphical user interfaces (GUIs) to visualize and interact with the data. In addition to these technical responsibilities, I also provide training and support to clients on the use of MATLAB and its various toolboxes. This includes providing guidance on best practices and troubleshooting, as well as conducting workshops and webinars to help clients become proficient in using the platform. Overall, this job role requires a solid understanding of MATLAB programming, image processing, machine learning, microcontroller interface, and IoT, as well as strong problem-solving skills and the ability to work closely with clients to understand their specific needs and develop solutions that meet those needs.",
  },
  {
  title: "Matlab Developer Intern",
  cardImage: "assets/images/experience-page/MATLABHelper_Trans_Rect.png",
  place: "Jaipur, Rajasthan",
  time: "Internship",
  desp: "<br>As a MATLAB Developer Intern at MATLAB Helper, Jaipur, I gained hands-on experience in developing and testing MATLAB algorithms for software development stages. During my internship, I worked on stock market Apps, IPL prediction 2019, and Marketing Post creations, which included algorithms and data processing, strategy implementation, web scraping, and application development. I also collaborated with technical, media, and research assistants to develop efficient and effective solutions to complex problems. Some of my key achievements during my internship included optimizing code, improving the performance of an algorithm, and developing a new app with an interactive GUI. I also gained experience in working with electrical and electronics toolbox technologies, such as Simulink for embedded systems, which has helped me expand my skillset and become a more versatile developer. Overall, my experience as a MATLAB Developer Internship helped me develop my technical skills and gain practical knowledge in MATLAB development. I am now equipped with the tools and experience necessary to excel as a MATLAB Developer in a variety of industries.",
  },
  {
  title: "Strategy Consulting",
  cardImage: "assets/images/experience-page/boston-consulting-group-bcg-vector-logo.png",
  place: "USA (Remote)",
  time: "Jan 2023 - Feb 2023 · 2 mos",
  desp: "<h2> Internship</h2><a>The internship program is relevant towards market research, data analysis, data modeling, and consumer need with the recommendation for project management and solution to the goal strategies.<br>",
  },
  {
  title: "Asociacion De Investigacion En Inteligencia Artificial Para La Leucemia Peter Moss",
  cardImage: "assets/images/experience-page/LEUCEMIA.jpg",
  place: " Sabadell, Catalonia, Spain",
  time: "Apr 2020 - Sep 2021 · 1 yr 6 mos",
  desp: "<h2> AI R&D Engineer </h2><br>As an AI R&D Engineer for the Peter Moss Leukemia AI Research Association (Asociacion De Investigacion En Inteligencia Artificial Para La Leucemia), a non-profit and open-source organization, my main responsibility is to conduct research and development in the field of artificial intelligence (AI) and machine learning (ML) as they relate to leukemia. This includes developing and implementing cutting-edge AI and ML models to analyze and interpret large amounts of medical data, such as imaging and patient records, in order to improve the diagnosis, treatment, and overall understanding of leukemia. I work closely with a team of researchers, medical professionals, and other engineers to design and carry out experiments, evaluate the results, and communicate the findings to the wider scientific community. Additionally, I contribute to the organization's open-source software development efforts, developing and maintaining code for the tools and models that are used in our research. In this role, I stay up-to-date with the latest advancements and trends in AI and ML research, and actively seek out new techniques and technologies that can be applied to the specific challenges faced in leukemia research. Additionally, I also take part in the organization's public outreach and education efforts to raise awareness about the importance of AI in healthcare, and the work that the organization is doing to advance this field. Overall, this experience has been a great opportunity to apply my skills in AI and ML to a meaningful and impactful area of research, while also working with a dedicated and passionate team of professionals towards a common goal of improving the lives of leukemia patients.",
  },
  {
  title: "Accenture Discovery Program",
  cardImage: "assets/images/experience-page/Accenture-logo.png",
  place: "USA (Remote)",
  time: "Jun 2020 · 1 mo",
  desp: "<h2>Internship</h2><br>As an intern at Accenture, I participated in the company's Discovery Program, which provided me with a comprehensive introduction to the world of consulting. During the program, I attended educational workshops on a variety of topics, including sustainability, AI, XR, and design thinking. I also had the opportunity to solve challenging problems alongside other students. The program consisted of four physical gatherings and was a combination of educational input and social activities. Throughout the program, I was assigned a mentor from Accenture who helped guide my development through monthly conversations. The Discovery Program culminated in a competitive interview process for Accenture's highly sought-after six-week summer internship. During the internship, I worked in cross-functional teams, completing a real-life project just like Accenture consultants. This experience allowed me to further develop my skills and gain hands-on experience in the consulting field.",
  },
  {
  title: "Expert Global Solutions Inc",
  cardImage: "assets/images/experience-page/expert_global.png",
  place: " Aurangabad, Maharashtra, India",
  time: "Jun 2011 - Aug 2011 · 3 mos",
  desp: "<h2> Hardware and networking Engineer</h2><br>As an intern at Expert Global Solution Pvt Ltd, Aurangabad, I gained valuable experience in Computer Hardware and Networking Engineering. During my internship, I had the opportunity to work on operating system installation and industrial IT networks on servers based on windows and Linux and learned how to handle management and technical problems in due time. I also had the chance to collaborate with the Industrial automation sector and IT administrator and contribute to channeling the data communication and gateway system on the servers and networking protocols. Some of my key achievements during my internship included completing a project, delivering a presentation, and working with a professional network engineer and assisting them. Overall, my experience was instrumental in helping me develop my skills and gain practical knowledge in electronics and computer networking.",
  },
  ];

const showCards2 = () => {
  let output = "";
  exp.forEach(
    ({ title, cardImage, place, time, desp }) =>
      (output += `        
    <div class="col gaap" data-aos="fade-up" data-aos-easing="linear" data-aos-delay="100" data-aos-duration="400"> 
      <div class="card card1">
        <img src="${cardImage}" class="featured-image"/>
        <article class="card-body">
          <header>
            <div class="title">
              <h3>${title}</h3>
            </div>
            <p class="meta">
              <span class="pre-heading">${place}</span><br>
              <span class="author">${time}</span>
            </p>
            <ol>
              ${desp}
            </ol>
          </header>
        </article>
      </div>
    </div>
      `)
  );
  experiencecards.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", showCards2);

// Data for Open Source experiences
const openSourceExperiences = [
  {
      title: "Developer",
      organization: "Dolby (Open Source)",
      year: "2020"
  },
  {
      title: "Game Developer",
      organization: "Epic Games (Open Source)",
      year: "2020"
  },
  {
      title: "Developer",
      organization: "DevMesh Intel",
      year: "2018"
  },
  {
      title: "Hardware Reviewer",
      organization: "Element 14",
      year: "2018 - Present"
  },
  {
      title: "Maker",
      organization: "Hackster.io",
      year: "2016 - Present"
  }
];

// Function to generate the Open Source experience cards
function generateOpenSourceCards() {
  const openSourceCardsContainer = document.getElementById("openSourceCards");

  openSourceExperiences.forEach(experience => {
      const card = document.createElement("div");
      card.classList.add("card");

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const title = document.createElement("h2");
      title.textContent = experience.title;

      const organization = document.createElement("p");
      organization.textContent = experience.organization;

      const year = document.createElement("p");
      year.textContent = experience.year;

      cardBody.appendChild(title);
      cardBody.appendChild(organization);
      cardBody.appendChild(year);
      card.appendChild(cardBody);

      openSourceCardsContainer.appendChild(card);
  });
}

// Call the function to generate the Open Source cards
generateOpenSourceCards();


// Volunteership Cards

const volunteership = document.querySelector(".volunteership-cards");
const volunteeringCards = [
  {
    title: "IEEE CEDA Bombay - Nagpur Chapter",
    cardImage: "assets/images/volunteering-page/ieee-future-networks.jpg",
    place: "IEEE CEDA",
    time: "Apr 2024 - Present · 3 mos",
    description:
    "Science and Technology",
    role: "Chair (CEDA Bombay Chapter)",
  },
  {
  title: "IEEE Future Networks",
  cardImage: "assets/images/volunteering-page/ieee-future-networks.jpg",
  place: "IEEE Future Networks",
  time: "Apr 2023 - Present · 3 mos",
  description:
  "Science and Technology",
  role: "Vice Chair (SIGHT Bombay Chapter)",
  },
  {
  title: "IEEE SIGHT",
  cardImage: "assets/images/volunteering-page/ieee-sight.jpg",
  place: "IEEE SIGHT",
  time: "Jan 2023 - Present · 6 mos",
  description:
  "Social Services",
  role: "Vice Chair (SIGHT Bombay Chapter)",
  },
  {
  title: "Arm Developer Ambassador",
  cardImage: "assets/images/volunteering-page/arm-developer-ambassador.jpg",
  place: "Arm",
  time: "Jan 2023 - Present · 6 mos",
  description:
  "Science and Technology",
  role: "Arm Developer Ambassador",
  },
  {
  title: "IEEE.tv",
  cardImage: "assets/images/volunteering-page/ieee-tv.jpg",
  place: "IEEE.tv",
  time: "Jul 2022 - Jan 2023 · 7 mos",
  description:
  "Education",
  role: "Global Ambassador",
  },
  {
  title: "IEEE Bombay Section Technical and Professional Committee",
  cardImage:
  "assets/images/volunteering-page/ieee-bombay-section-technical-committee.jpg",
  place: "IEEE Bombay Section Technical and Professional Committee",
  time: "Mar 2022 - Nov 2022 · 9 mos",
  description:
  "Education",
  role: "Volunteer",
  },
  {
  title: "IEEE Move India",
  cardImage: "assets/images/volunteering-page/ieee-move-india.jpg",
  place: "IEEE Move India",
  time: "Feb 2022 - Dec 2022 · 11 mos",
  description:
  "Disaster and Humanitarian Relief",
  role: "Community Volunteer",
  },
  {
  title: "IEEE PES HAC Student Ambassador",
  cardImage: "assets/images/volunteering-page/ieee-pes-hac-student-ambassador.jpg",
  place: "IEEE Power & Energy Society",
  time: "Oct 2018 - Dec 2018 · 3 mos",
  description:
  "Social Services",
  role: "Volunteer",
  },
  {
  title: "Google Cloud Developer Community Mumbai",
  cardImage:
  "assets/images/volunteering-page/google-cloud-developer-community-mumbai.jpg",
  place: "Google Cloud Developer Community Mumbai",
  time: "Sep 2018 - Present · 4 yrs 10 mos",
  description:
  "Social Services",
  role: "Volunteer",
  },
  {
  title: "IEEE Cloud Computing",
  cardImage: "assets/images/volunteering-page/ieee-cloud-computing.jpg",
  place: "IEEE Cloud Computing",
  time: "Feb 2016 - Present · 7 yrs 5 mos",
  description:
  "Education",
  role: "Volunteer",
  },
  {
  title: "Google Cloud Community India",
  cardImage:
  "assets/images/volunteering-page/google-cloud-community-india.jpg",
  place: "Google Cloud Community India",
  time: "Aug 2018 - Aug 2019 · 1 yr 1 mo",
  description:
  "Science and Technology",
  role: "MLCC Study Jam Facilitator",
  },
  {
  title: "IEEE MIT(T) Student Branch Aurangabad",
  cardImage:
  "assets/images/volunteering-page/ieee-mit-student-branch-aurangabad.jpg",
  place: "IEEE MIT(T) Student Branch Aurangabad",
  time: "Jan 2018 - Feb 2019 · 1 yr 2 mos",
  description:
  "Science and Technology",
  role: "Chairman",
  },
  {
  title: "IEEE Bombay Section",
  cardImage: "assets/images/volunteering-page/ieee-bombay-section.jpg",
  place: "IEEE Bombay Section",
  time: "Aug 2017 - Sep 2018 · 1 yr 2 mos",
  description:
  "Social Services",
  role: "Divisional Activity Chair",
  },
  {
  title: "Google Crowdsource",
  cardImage: "assets/images/volunteering-page/google-crowdsource.jpg",
  place: "Google Crowdsource",
  time: "Dec 2017 - Present · 5 yrs 7 mos",
  description:
  "Social Services",
  role: "Influencer",
  },
  {
  title: "IEEE Day",
  cardImage: "assets/images/volunteering-page/ieee-day.jpg",
  place: "IEEE Day",
  time: "Aug 2016 - Aug 2017 · 1 yr 1 mo",
  description:
  "Social Services",
  role: "Section Ambassador",
  },
  {
  title: "Hackster.io",
  cardImage: "assets/images/volunteering-page/hackster-io.jpg",
  place: "Hackster.io",
  time: "Jan 2016 - Oct 2019 · 3 yrs 10 mos",
  description:
  "Education",
  role: "Lead Ambassador",
  },
  {
  title: "IEEEXtreme",
  cardImage: "assets/images/volunteering-page/ieeextreme.jpg",
  place: "IEEEXtreme",
  time: "Jul 2015 - Sep 2018 · 3 yrs 3 mos",
  description:
  "Social Services",
  role: "IEEEXtreme Ambassador",
  },
  {
  title: "Mozilla India",
  cardImage: "assets/images/volunteering-page/mozilla-india.jpg",
  place: "Mozilla India",
  time: "Aug 2015 - Jun 2016 · 11 mos",
  description:
  "Social Services",
  role: "Firefox Student Ambassador",
  },
  ];

const showCards = () => {
  let output = "";
  volunteershipcards.forEach(
    ({ title, cardImage, description }) =>
      (output += `        
      <div class="card volunteerCard" data-aos="fade-down" data-aos-easing="linear" data-aos-delay="100" data-aos-duration="600" style="height: 550px;width:400px">
      
      <img src="${cardImage}" height="250" width="65" class="card-img" style="border-radius:10px">
      <div class="content">
          <h2 class="volunteerTitle">${title}</h2><br>
          <p class="copy">${description}</p></div>
      
      </div>
      `)
  );
  volunteership.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", showCards);

// Hackathon Section

const hackathonsection = document.querySelector(".hackathon-section");
const mentor = [
  {
  title: "Intel® oneAPI Hackathon for Open Innovation",
  cardImage: "assets/images/hackathon-page/oneapi_hack.png",
  description: "Over the years, technology has revolutionized our world and changed our daily lives where everything is connected and accessible with clicks. oneAPI is one such tech stack which has great potential to build many innovative solutions for good.",
  eventLink: "https://www.hackerearth.com/challenges/hackathon/intel-oneapi-hackathon-for-open-innovation/",
  highlights: [
  "Showcase your skills through innovation with oneAPI for social good.",
  "Use your skills in Machine Learning, Deep Learning, Analytics with oneAPI to build solutions for compelling problems.",
  "Get free hands-on training from Intel® experts.",
  "Workshops on various oneAPI toolkits to enable developers to learn oneAPI with ease.",
  "Build solutions using Intel® oneAPI AI Analytics Toolkits.",
  ],
  },
  ];

const showCards3 = () => {
  let output = "";
  mentor.forEach(
    ({ title, image, subtitle, desp, href }) =>
      (output += `  
      <div class="blog-slider__item swiper-slide">
        <div class="blog-slider__img">
            <img src="${image}" alt="">
        </div>
        <div class="blog-slider__content">
          <div class="blog-slider__title">${title}</div>
          <span class="blog-slider__code">${subtitle}</span>
          <div class="blog-slider__text">${desp}</div>
          <a href="${href}" class="blog-slider__button">Read More</a>   
        </div>
      </div>
      `)
  );
  hackathonsection.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", showCards3);
