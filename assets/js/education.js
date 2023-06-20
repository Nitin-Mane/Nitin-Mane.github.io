AOS.init();

// MOOCs Cards

const moocs = document.querySelector(".moocs");

const moocscards = [
  {
  title: "Google Data Analyst Specialization",
  cardImage: "assets/images/education-page/coursera2.svg",
  moocLink: "https://www.coursera.org/specializations/google-data-analyst",
  },
  {
  title: "Google Data Engineering Specialization",
  cardImage: "assets/images/education-page/coursera2.svg",
  moocLink: "https://www.coursera.org/specializations/google-data-engineering",
  },
  {
  title: "Google Cloud Engineering Specialization",
  cardImage: "assets/images/education-page/coursera2.svg",
  moocLink: "https://www.coursera.org/specializations/cloud-engineering-google-cloud",
  },
  {
  title: "OpenVINO for IoT Developer Nanodegree",
  cardImage: "assets/images/education-page/udacity.svg",
  moocLink: "https://www.udacity.com/course/intel-edge-ai-for-iot-developers-nanodegree--nd131",
  },
  {
  title: "Effective MLOps - Model Development",
  cardImage: "assets/images/education-page/wandb.svg",
  moocLink: "https://www.credential.net/43b2aef4-7200-4e3d-aa48-bae8fb212a17",
  },
  {
  title: "Introduction to Intel® Distribution of OpenVINO™ toolkit for Computer Vision Applications",
  cardImage: "assets/images/education-page/coursera2.svg",
  moocLink: "https://www.coursera.org/learn/intel-openvino-toolkit",
  },
  {
  title: "Geospatial Inputs for Enabling Master Plan Formulation",
  cardImage: "assets/images/education-page/iirs.png",
  moocLink: "https://www.iirs.gov.in/",
  },
  {
  title: "Data Analysis with R Programming",
  cardImage: "assets/images/education-page/coursera2.svg",
  moocLink: "https://www.coursera.org/learn/data-analysis-with-r",
  },
  {
  title: "Getting Started with AI on Jetson Nano",
  cardImage: "assets/images/education-page/nvidia-seeklogo.com.svg", 
  moocLink: "https://www.nvidia.com/en-us/ai-academy/ai-lab-getting-started/",
  },
  {
  title: "ICSI CNSS Certified Network Security Specialist",
  cardImage: "assets/images/education-page/icsi.jpg",
  moocLink: "https://www.icsi.co.uk/courses/certified-network-security-specialist",
  },
  {
  title: "Machine Learning with Python",
  cardImage: "assets/images/education-page/cognitive-class.png",
  moocLink: "https://cognitiveclass.ai/courses/machine-learning-with-python/",
  },
  {
  title: "Aviatrix Certified Engineer",
  cardImage: "assets/images/education-page/aviatrix.png",
  moocLink: "https://aviatrix.com/certification/",
  },
  {
  title: "Advanced Google Analytics",
  cardImage: "assets/images/education-page/icons8-google-240.svg",
  moocLink: "https://analytics.google.com/analytics/academy/course/7",
  },
  {
  title: "Ocean Wave Energy Advancement through Research, Development and Testing",
  cardImage: "assets/images/education-page/ieee.png",
  moocLink: "https://www.ieee.org/",
  },
  ];

const experience = [
  {
    img: "assets/images/education-page/c1.png",
  },
  {
    img: "assets/images/education-page/c2.jpg",
  },
  {
    img: "assets/images/education-page/c3.png",
  },
  {
    img: "assets/images/education-page/c4.png",
  },
  {
    img: "assets/images/education-page/c5.jpg",
  },
];

let currentItem = 0;

const img = document.getElementById("image");

const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

window.addEventListener("DOMContentLoaded", function () {
  showExperience();
});

function showExperience() {
  setInterval(function () {
    if (currentItem === experience.length) {
      currentItem = 0;
    }
    const item = experience[currentItem];
    img.src = item.img;
    currentItem++;
  }, 3000);
}

const showCards = () => {
  let output = "";
  moocscards.forEach(
    ({ title, cardImage, moocLink }) =>
      (output += `        
        <div class="col-6 col-md-3 col-sm-4 column" data-aos="fade-up" data-aos-easing="linear" data-aos-delay="600" >  
            <div class="card mb-3 mx-auto">
               <div class="content">
                  <div class="content-overlay"></div>
                    <img src=${cardImage} class="card-img-top content-image">     
                  <div class="content-details fadeIn-bottom">
                    <a href="${moocLink}" target="_blank"><i class="fa fa-info-circle fa-2x" aria-hidden="true" style="color: white;"></i></a>                                   
                  </div>
                </div>
                <div class="card-body">
                    <h6 class="mt-0 py-2 text-center font-weight-bold mooc-title" style="font-size:12px;">${title}</h6>
                </div>
            </div>
        </div>        
      `)
  );
  moocs.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", showCards);

/* Badges*/

const bagdes = document.querySelector(".badges");
const badgesection = [
  {
    title: "Google Developer Essentials",
    image: "assets/images/education-page/badge1.png",
    description: "Earned May 20, 2020",
  },
  {
    title: "VM Migration",
    image: "assets/images/education-page/badge2.png",
    description: "Earned June 20, 2020",
  },
  {
    title: "G Suite Essentials",
    image: "assets/images/education-page/badge3.png",
    description: "Earned July 20, 2020",
  },
];

const showCards1 = () => {
  let output = "";
  badgesection.forEach(
    ({ title, image, description }) =>
      (output += `       
      <div class="col-lg-4 col-md-6 p-2" data-aos="fade-up" data-aos-easing="linear" data-aos-delay="600"> 
        <img class="img-fluid d-block mb-3 mx-auto hvr-grow" src="${image}" alt="Card image cap" width="200">
          <div class="text-center font-weight-bolder" style="font-size: 1.3em;">${title}</div>
          <div class="text-center text-muted font-weight-bolder p-2">${description}</div>
      </div>`)
  );
  bagdes.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", showCards1);

/* Timeline Section*/

$(function () {
  window.sr = ScrollReveal();

  if ($(window).width() < 768) {
    if ($(".timeline-content").hasClass("js--fadeInLeft")) {
      $(".timeline-content")
        .removeClass("js--fadeInLeft")
        .addClass("js--fadeInRight");
    }

    sr.reveal(".js--fadeInRight", {
      origin: "right",
      distance: "300px",
      easing: "ease-in-out",
      duration: 800,
    });
  } else {
    sr.reveal(".js--fadeInLeft", {
      origin: "left",
      distance: "300px",
      easing: "ease-in-out",
      duration: 800,
    });

    sr.reveal(".js--fadeInRight", {
      origin: "right",
      distance: "300px",
      easing: "ease-in-out",
      duration: 800,
    });
  }

  sr.reveal(".js--fadeInLeft", {
    origin: "left",
    distance: "300px",
    easing: "ease-in-out",
    duration: 800,
  });

  sr.reveal(".js--fadeInRight", {
    origin: "right",
    distance: "300px",
    easing: "ease-in-out",
    duration: 800,
  });
});
