let lang = 'en';

// Personal data
fetch(`assets/data/${lang}/personal.json`)
    .then(res => res.json())
    .then(data => {
        document.getElementById('name-data').textContent = data.name.toUpperCase();
        document.getElementById('position-data').textContent = data.position;
        document.getElementById('about-data').textContent = data.about;
        document.querySelectorAll('.nick-name-data').forEach(element => {
            element.innerHTML = data.nickname.toUpperCase();;
        });

        // Social Media Section
        const username = data.contact.username ? `with username <b>@${data.contact.username}</b>` : '';
        let socialMediaHTML = '';
        data.contact.social_media.forEach((socialMedia, index) => {
            let socialMediaComponent = document.getElementById('social-media-link-component').cloneNode(true);
            socialMediaComponent.querySelector('#social-media-link-component-url').href = `${socialMedia.url}`;
            socialMediaComponent.querySelector('#social-media-link-component-name').innerHTML = `${socialMedia.name}`;
            if (index !== 0) socialMediaHTML += ` | `
            socialMediaHTML += socialMediaComponent.outerHTML;
        });
        document.getElementById('social-media-data').innerHTML = `
        Find me ${username} in ${socialMediaHTML}
        `;

        // Email Section
        const email = data.contact.email;
        document.getElementById('email-data').innerHTML = `
        Or, send email to <b><a href="mailto:${email}">${email}</a></b>
        `;
    })
    .catch(error => {
        console.error('Error fetching: ', error);
    });

// Experience data
fetch(`assets/data/${lang}/experience.json`)
    .then(res => res.json())
    .then(data => {
        const experienceData = data;
        let experienceHTML = '';
        experienceData.reverse().forEach(experience => {
            let experienceComponent = document.getElementById('experience-card-component').cloneNode(true);
            experienceComponent.querySelector('#experience-card-title').innerHTML = `${experience.position}`;
            experienceComponent.querySelector('#experience-card-company').innerHTML = `${experience.company_name}`;
            experienceComponent.querySelector('#experience-card-year').innerHTML = `${experience.year.start} - ${experience.year.end}`;
            let jobDescHTML = '';
            experience.job_desc.forEach(jobDesc => {
                jobDescHTML += `${jobDesc}<br>`;
            })
            experienceComponent.querySelector('#experience-card-job-desc').innerHTML = jobDescHTML;

            experienceHTML += experienceComponent.outerHTML;
        });

        document.getElementById('experience-list-data').innerHTML = experienceHTML;
    });

// Education data
fetch(`assets/data/${lang}/education.json`)
    .then(res => res.json())
    .then(data => {
        const educationData = data;
        let educationHTML = '';
        educationData.reverse().forEach(education => {
            let educationComponent = document.getElementById('education-card-component').cloneNode(true);
            educationComponent.querySelector('#education-card-major').innerHTML = `${education.major}`;
            educationComponent.querySelector('#education-card-name').innerHTML = `${education.name}`;
            educationComponent.querySelector('#education-card-year').innerHTML = `${education.year.start} - ${education.year.end}`;

            educationHTML += educationComponent.outerHTML;
        });

        document.getElementById('education-list-data').innerHTML = educationHTML;
    });

// Project data
fetch(`assets/data/${lang}/project.json`)
    .then(res => res.json())
    .then(data => {
        const projectData = data.sort(() => 0.5 - Math.random()).slice(0, 3); //coming soon - limit 3 project in function, can call in random button
        let projectHTML = '';
        projectData.forEach(project => {
            let projectComponent = document.getElementById('project-card-component').cloneNode(true);
            projectComponent.querySelector('#project-card-title').innerHTML = `${project.title}`;
            projectComponent.querySelector('#project-card-desc').innerHTML = `${project.desc}`;
            projectComponent.querySelector('#project-card-image').src = `assets/img/projects/${project.img}`;
            projectComponent.querySelector('#project-card-image').alt = `${project.title}`;

            projectHTML += projectComponent.outerHTML;
        })

        document.getElementById('project-list-data').innerHTML = projectHTML;
    });

// Article data
fetch(`assets/data/${lang}/article.json`)
    .then(res => res.json())
    .then(data => {
        const articleData = data.sort(() => 0.5 - Math.random()).slice(0, 3); //coming soon - limit 3 project in function, can call in random button

        let articleHTML = '';
        articleData.forEach(article => {
            let articleComponent = document.getElementById('article-card-component').cloneNode(true);
            articleComponent.querySelector('#article-card-title').innerHTML = `${article.title}`;
            articleComponent.querySelector('#article-card-content').innerHTML = `${article.content}`;

            articleHTML += articleComponent.outerHTML;
        });

        document.getElementById('article-list-data').innerHTML = articleHTML;
    });

// Certificate data
fetch(`assets/data/${lang}/certification.json`)
.then(res => res.json())
.then(data => {
    let certificationData = data;
    let certificationHTML = '';
    certificationData.reverse().forEach(certification => {
        let certificationComponent = document.getElementById('certification-card-component').cloneNode(true);
        certificationComponent.querySelector('#certification-card-title').innerHTML = `${certification.title}`;
        if(certification.credential_id){
            certificationComponent.querySelector('#certification-card-credential').innerHTML = `${certification.credential_id}`;
        }else{
            //remove div #certification-card-credential
            certificationComponent.querySelector('#certification-card-credential').remove();
        }
        certificationComponent.querySelector('#certification-card-publisher').innerHTML = `${certification.publisher}`;
        if(certification.published) certificationComponent.querySelector('#certification-card-year').innerHTML = `<b> | </b>${certification.published}`;

        certificationHTML += certificationComponent.outerHTML;
    });

    document.getElementById('certification-list-data').innerHTML = certificationHTML;
});