/*Research Details Table*/

const researchTable = document.querySelector(".main");


const research = [
  {
  title: "An Improved Object Tracking and Estimating Using Adaptive Kalman Filter Based Yolov5 Model and Mixed Precision for Efficient Inference Performance",
  authors: "Your Name and Co-authors",
  conferences: "Publisher: SSRN Electronic Journal",
  researchYr: 2022,
  citebox: "popup1",
  image: "assets/images/research-page/nitin_research.png",
  citation: {
  vancouver:
  "Mishra, Abhilasha and Mane, Nitin and Mishra, Aaditya and Dixit, Amitabh and Mishra, Sparsh and Agrawal, Aditi and Pagare, Rajendraprasad, An Improved Object Tracking and Estimating Using Adaptive Kalman Filter Based Yolov5 Model and Mixed Precision for Efficient Inference Performance. Available at SSRN: https://ssrn.com/abstract=4187576 or http://dx.doi.org/10.2139/ssrn.4187576",
  },
  abstract:
  "The computer vision techniques and object detection research are focused on improving human vision and identification of objects in various working scenarios. This research proposes an improved technique using the YOLOv5 Model with an adaptive Kalman filter for real-time object tracking and estimation. The research addresses challenges such as camera alignment, image quality, darkness, occlusion, and other environmental factors. The proposed technique achieves better performance by utilizing mixed precision for processor selection and parallel distribution of features. The research demonstrates high model accuracy and real-time processing capabilities. The results show a training model accuracy of 98% and testing dataset accuracy of 95.4% for surveillance applications. The model performs with a throughput of 14.8 and an inference rate of 45 FPS for 1080p resolution. This research contributes to overcoming tracking challenges and provides solutions for processing conditional cases. DOI: 10.2139/ssrn.4187576",
  absbox: "absPopup1",
  },
  ];


AOS.init();
const fillData = () => {
  let output = "";
  research.forEach(
    ({
      image,
      title,
      authors,
      conferences,
      researchYr,
      citebox,
      citation,
      absbox,
      abstract,
    }) =>
      (output += `
            <tr data-aos="zoom-in-left"> 
                <td class="imgCol"><img src="${image}" class="rImg"></td>
                <td class = "researchTitleName">
                    <div class="img-div">
                        <span class="imgResponsive">
                            <img src="${image}" class="imgRes">
                        </span>
                    </div>
                    <a href="#0" class="paperTitle"> ${title} </a> 
                    <div class = "authors"> ${authors} </div> 
                    
                    <div class="rConferences"> ${conferences} 
                        <div class="researchY">${researchYr}</div>
                    </div>
                    
                    <!--CITE BUTTON-->
                    <div class="d-flex" style="margin-right:5%;">
                        <button class="button button-accent button-small text-right button-abstract " type="button" data-toggle="collapse" data-target="#${absbox}" aria-expanded="false" aria-controls="${absbox}">
                            ABSTRACT
                        </button>
                
                        <button class="button button-accent button-small text-right button-abstract " type="button" data-toggle="collapse" data-target="#${citebox}" aria-expanded="false" aria-controls="${citebox}">
                            CITE
                        </button>
                    </div>
                    <div id="${absbox}" class="collapse" aria-labelledby="headingTwo" data-parent=".collapse">
                        <div class="card-body">
                            ${abstract}    
                        </div>
                    </div>
                    <div id="${citebox}" class="collapse" aria-labelledby="headingTwo" data-parent=".collapse">
                        <div class="card-body">
                            ${citation.vancouver}    
                        </div>
                    </div>
                </td>
            </tr>`)
  );
  researchTable.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", fillData);
