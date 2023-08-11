export const instructions = `
You are going to generate a description for a job or project that will be posted online to hire people that will be willing to take on the job or project. The job or project might involve hiring multiple people in different roles, so you must accommodate all that into the description.

The target audience are enterprise application developers. You will be provided some information to help in this task.

The information provided will include:

1. The service type will tell whether person intends to hire a single person or a team or outsource the work, or some other model of recruitment.
2. The business domain of the software that the hirees will be working on or building
3. The list of required experience for the candidates. Each role in the team will be associated with a software that person is expected to know and use. The list of requirements will be a comma separated list. Each line will be:
  a. the name of the software
  b. the years of experience the candidate must have in the software
  c. the role in the team associated with the software
  d. the years of experience the candidate must have in the role
4. List of technology that candidates are expected to be experienced with. Each line in the list will be identified by a category, which is the part before the colon, followed by a comma-separated list of software in that category.
5. List of industries that candidates are expected to be experienced with. Each line in the list will be identified by a category, which is the part before the colon, followed by a comma-separated list of industries in that category.

Do not generate information about the employer, such as 'About Us', 'How To Apply', 'Contact Information', 'Why Us', etc."

Output must be plain text that anyone can copy and edit as text
`;

export const sampleResponse = `
The following is a sample response
----------------------------------

Join Our Enterprise Application Talent Team in Supply Chain Management (SCM)

Are you a skilled and motivated enterprise application developer ready to take on exciting challenges in the realm of Supply Chain Management (SCM)? We are searching for dynamic individuals to join our dedicated team of experts and contribute to the development of cutting-edge software solutions in the SCM domain. If you're passionate about streamlining business operations and enhancing supply chain efficiency, this is the opportunity you've been waiting for!

Roles and Responsibilities

As a part of our team, you will play a pivotal role in developing and optimizing enterprise-level applications for Supply Chain Management. Your expertise in the following software and roles, along with corresponding years of experience, will be crucial:

Business Analyst (BluJay Solutions)

- Required Expertise: BluJay Solutions (3 years), Business Analyst role (2 years)
- Collaborate with stakeholders to gather and analyze business requirements, translating them into functional specifications and user stories. 
- Facilitate effective communication between technical and non-technical teams.

Analyst (Acumatica)

- Required Expertise: Acumatica (3 years), Analyst role (2 years)
- Participate in system analysis, design, development, and testing. 
- Identify opportunities for system enhancements and optimizations. 
- Contribute to the design and implementation of scalable solutions.


Technology Stack

Our ideal candidate is well-versed in a range of technologies, including:

- Administration: BluJay Solutions Admin Console
- APIs: BluJay Solutions API
- Client-side customization: CSS, HTML, JavaScript
- Database: Microsoft SQL Server, Oracle Database
- DevOps Integration Tools: Azure DevOps, Bamboo, CircleCI, GitLab, Jenkins
- Frameworks: AngularJS, Spring Framework
- Server-side customization: Java, Spring Framework

Industries

Familiarity with the following industries is a plus:

- Administrative Services: Archiving Service, Call Center, Collection Agency
- Advertising: Ad Exchange

Join Us

If you are an experienced enterprise application developer with a passion for SCM and a desire to make a significant impact, we invite you to join our team. Collaborate with like-minded professionals, contribute to innovative projects, and propel your career to new heights.

Take the next step in your journey by applying today. Your skills and dedication could be the missing piece we need to revolutionize the world of Supply Chain Management.
`;