export const instructions = `
The above information within the backticks are information collected from an organization about their hiring requirements.
Given the above information, figure out what kind of job or project they are likely to be hiring for, and write a job or project description for the same.

The output must include:
1. The project/job title
2. A project summary
3. Responsibilities for each role provided in the input. 
   Do mention the software. Inside this section, try to accurately incorporate/allocate all the tech stack items indicated, as per the role and software. 
   You do not need to add sub-sections according to aspects of the roles.

4. The industries that candidates are expected to be familiar with

Do not add numbers to the parts mentioned above.
Do not mention the no. of years, or no. of open positions.
Do not include sections such as 'Why Us'. 'About Us', 'Join Us', 'Application Process', or any notes.

Output should be plain text, but you can use numbers, letters or dashes for bullets
`;
