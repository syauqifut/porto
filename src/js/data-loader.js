let lang = window.__ENV__.LANG ?? "data-example";
loadData(lang);

const languageBtn = document.getElementById("languageBtn");
languageBtn.addEventListener("click", () => {
  lang = lang === "en" ? "id" : "en";
  loadData(lang);
});

function loadData(lang) {
  let dir = 'data-example';
  if (lang != 'data-example') {
    dir = 'data';
  }
  // Personal data
  fetch(`assets/${dir}/personal.json`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("name-data").textContent =
        data.name.toUpperCase();
      document.getElementById("position-data").textContent = data.position;
      document.getElementById("about-data").textContent = richTextFormatGenerator(
        localize(data.about, lang)
      );
      document.querySelectorAll(".nick-name-data").forEach((element) => {
        element.innerHTML = data.nickname.toUpperCase();
      });
    })
    .catch((error) => {
      console.error("Error fetching: ", error);
    });

    // Contact data
  fetch(`assets/${dir}/contact.json`)
  .then((res) => res.json())
  .then((data) => {
    // Profesional Social Media Section
    const profUsername = `<b>@${data.profesional_account}</b>`;
    let profSocialMediaHTML = "";
    data.profesional_media.forEach((socialMedia, index) => {
      let socialMediaComponent = document
        .getElementById("social-media-link-component")
        .cloneNode(true);
      socialMediaComponent.querySelector(
        "#social-media-link-component-url"
      ).href = `${socialMedia.url}`;
      socialMediaComponent.querySelector(
        "#social-media-link-component-name"
      ).innerHTML = `${socialMedia.name}`;
      if (index !== 0) profSocialMediaHTML += ` | `;
      profSocialMediaHTML += socialMediaComponent.outerHTML;
    });
    document.getElementById("profesional-internet-data").innerHTML = `
      Profesional using ${profUsername} in ${profSocialMediaHTML}
      `;

    // Profesional Social Media Section
    const PerUsername = `<b>@${data.personal_account}</b>`;
    let PerSocialMediaHTML = "";
    data.personal_media.forEach((socialMedia, index) => {
      let socialMediaComponent = document
        .getElementById("social-media-link-component")
        .cloneNode(true);
      socialMediaComponent.querySelector(
        "#social-media-link-component-url"
      ).href = `${socialMedia.url}`;
      socialMediaComponent.querySelector(
        "#social-media-link-component-name"
      ).innerHTML = `${socialMedia.name}`;
      if (index !== 0) PerSocialMediaHTML += ` | `;
      PerSocialMediaHTML += socialMediaComponent.outerHTML;
    });
    document.getElementById("personal-internet-data").innerHTML = `
      Personal life using ${PerUsername} in ${PerSocialMediaHTML}
      `;

    // Email Section
    const email = data.email;
    document.getElementById("email-data").innerHTML = `
      Email to <b><a href="mailto:${email}">${email}</a></b>
      `;
  })
  .catch((error) => {
    console.error("Error fetching: ", error);
  });

  // Experience data
  fetch(`assets/${dir}/experience.json`)
    .then((res) => res.json())
    .then((data) => {
      const experienceData = data;
      let experienceHTML = "";
      experienceData.reverse().forEach((experience) => {
        let experienceComponent = document
          .getElementById("experience-card-component")
          .cloneNode(true);
        experienceComponent.querySelector(
          "#experience-card-title"
        ).innerHTML = `${experience.position}`;
        experienceComponent.querySelector(
          "#experience-card-company"
        ).innerHTML = `${experience.company_name}`;
        experienceComponent.querySelector(
          "#experience-card-year"
        ).innerHTML = `${experience.year.start} - ${experience.year.end}`;
        let jobDescHTML = "";
        const jobLines = localize(experience.job_desc, lang);
        (Array.isArray(jobLines) ? jobLines : []).forEach((jobDesc) => {
          jobDescHTML += richTextFormatGenerator(jobDesc);
        });
        experienceComponent.querySelector(
          "#experience-card-job-desc"
        ).innerHTML = jobDescHTML;

        experienceHTML += experienceComponent.outerHTML;
      });

      document.getElementById("experience-list-data").innerHTML =
        experienceHTML;
    });

  // Education data
  fetch(`assets/${dir}/education.json`)
    .then((res) => res.json())
    .then((data) => {
      const educationData = data;
      let educationHTML = "";
      educationData.reverse().forEach((education) => {
        let educationComponent = document
          .getElementById("education-card-component")
          .cloneNode(true);
        educationComponent.querySelector(
          "#education-card-major"
        ).innerHTML = `${localize(education.major, lang)}`;
        educationComponent.querySelector(
          "#education-card-name"
        ).innerHTML = `${education.name}`;
        educationComponent.querySelector(
          "#education-card-year"
        ).innerHTML = `${education.year.start} - ${education.year.end}`;

        educationHTML += educationComponent.outerHTML;
      });

      document.getElementById("education-list-data").innerHTML = educationHTML;
    });

  // Project data
  fetch(`assets/${dir}/project.json`)
    .then((res) => res.json())
    .then((data) => {
      const projectData = data.sort(() => 0.5 - Math.random()).slice(0, 3);
      const container = document.getElementById("project-list-data");
      container.innerHTML = "";

      projectData.forEach((project) => {
        let projectComponent = document
          .getElementById("project-card-component")
          .cloneNode(true);

        projectComponent.querySelector("#project-card-title").innerHTML = project.title;
        projectComponent.querySelector("#project-card-desc").innerHTML = localize(project.desc, lang);
        projectComponent.querySelector("#project-card-image").src = `assets/img/projects/${project.img}`;
        projectComponent.querySelector("#project-card-image").alt = project.title;

        projectComponent.onclick = () => {
          projectModal.openDetail(project);
        };

        container.appendChild(projectComponent);
      });
    });

  // Article data
  fetch(`assets/${dir}/article.json`)
    .then((res) => res.json())
    .then((data) => {
      const articleData = [...data]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

      let articleHTML = "";
      articleData.forEach((article) => {
        let articleComponent = document
          .getElementById("article-card-component")
          .cloneNode(true);
        articleComponent.querySelector(
          "#article-card-title"
        ).innerText = `${article.title}`;
        articleComponent.querySelector(
          "#article-card-content"
        ).innerText = `${article.excerpt}`;

        articleComponent.href = article.link;
        articleComponent.target = "_blank";
        articleComponent.rel = "noopener noreferrer";

        articleHTML += articleComponent.outerHTML;
      });

      document.getElementById("article-list-data").innerHTML = articleHTML;
    });

  // Certificate data
  fetch(`assets/${dir}/certification.json`)
    .then((res) => res.json())
    .then((data) => {
      let certificationData = data;
      let certificationHTML = "";
      certificationData.reverse().forEach((certification) => {
        let certificationComponent = document
          .getElementById("certification-card-component")
          .cloneNode(true);
        certificationComponent.querySelector(
          "#certification-card-title"
        ).innerHTML = `${certification.title}`;
        if (certification.credential_id) {
          certificationComponent.querySelector(
            "#certification-card-credential"
          ).innerHTML = `${certification.credential_id}`;
          // }else{
          //     //remove div #certification-card-credential
          //     certificationComponent.querySelector('#certification-card-credential').remove();
        }
        certificationComponent.querySelector(
          "#certification-card-publisher"
        ).innerHTML = `${certification.publisher}`;
        if (certification.published)
          certificationComponent.querySelector(
            "#certification-card-year"
          ).innerHTML = `<b> | </b>${certification.published}`;

        certificationHTML += certificationComponent.outerHTML;
      });

      document.getElementById("certification-list-data").innerHTML =
        certificationHTML;
    });
}

function localize(value, lang) {
  if (
    value &&
    typeof value === "object" &&
    "id" in value &&
    "en" in value
  ) {
    return lang === "en" ? value.en : value.id;
  }
  return value;
}

function richTextFormatGenerator(string) {
  return `${string
    .replace(/_(.*?)_/g, "<i>$1</i>")
    .replace(/\*(.*?)\*/g, "<b>$1</b>")}<br>`;
}
