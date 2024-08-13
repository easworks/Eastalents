There are 2 major types of job-posting that EASWORKS has
- [job-post](https://github.com/easworks/Eastalents/blob/569ae7404029dd3f67f331a938757ac7095baf01/apps/web-client/src/admin/models/job-post.ts#L129)
- [managed projects](https://github.com/easworks/Eastalents/blob/569ae7404029dd3f67f331a938757ac7095baf01/apps/web-client/src/admin/models/managed-project.ts#L4)

<br>

For the customer, there are 4 service types:
https://github.com/easworks/Eastalents/blob/569ae7404029dd3f67f331a938757ac7095baf01/apps/web-client/src/admin/models/job-post.ts#L1-L6

If the customer chooses the last one, we will create a `ManagedProject`, otherwise we will create a `JobPost`.
Recommended to have different collections/tables for these 2 types, because they do not overlap


<br>

## Explanation for `JobPost` only

For now we will only tackle the `JobPost`.
We will start by describing the smallest parts first and use them to build up to the larger types

### Engagement

https://github.com/easworks/Eastalents/blob/569ae7404029dd3f67f331a938757ac7095baf01/apps/web-client/src/admin/models/job-post.ts#L178-L192 

This is an object that represents the working conditions:
- environment - remote, hybrid, on-premise, etc
- period -  the expected duration
- if it is part-time - then hourly payment, and no.of working hours per week
- if it is full-time - then the annual salary

### JobPostPosition

https://github.com/easworks/Eastalents/blob/569ae7404029dd3f67f331a938757ac7095baf01/apps/web-client/src/admin/models/job-post.ts#L171-L192

This is an object that represents:
- the required experience (junior, senior, etc)
- the PositionType - part-time, full-time, hourly-basis
- the number of people needed at the experience level and position
- The `Engagement` for that position

> Note
> - `PositionType` and `Engagement.type` are different.
> - `PostionType` is chosen by the user, and can be part-time, full-time, hourly, weekly, or any other value that we may present to the user 
> - Depending on the position type, the engagement type will only be either `part-time` or `full-time`.
> - The exact mapping for which `PositionType` maps to which `Engagement.type` will be determined by business rules.

### JobPostRoles

https://github.com/easworks/Eastalents/blob/569ae7404029dd3f67f331a938757ac7095baf01/apps/web-client/src/admin/models/job-post.ts#L160-L169

This is an object that represents:
- the role
- the software to be used in relation to that role (software ids)
- tech skills to be used in relation to that role (tech-skill ids)
- description of the tasks in that role
- a list of positions
  For example, we can have a requirement of 3 developers where 1 is senior full-time, and 2 are junior part-time
  That is 1 role but with 2 positions, having 3 "vacancies" (?)
- metrics that record the candidate funnel for that role

### JobPost

https://github.com/easworks/Eastalents/blob/569ae7404029dd3f67f331a938757ac7095baf01/apps/web-client/src/admin/models/job-post.ts#L129-L158

This is an object that hold the following information together:
- who created the job-post
- status of the job-post
- domains, modules, services, industries pertaining to the job-post
- the easworks service type
- the project type, i.e, nature of the project (new project, maintainance project, analytics project, etc) 
- tentative timeline for the project start
- a collection of roles that are part of the job-post
- aggregate metrics for the individual job roles


### Validations:
- Depending on the easworks service type selected, there is a limit on the total number of `JobPost.roles.positions`, that user can select
- Depending on the `JobPostPosition.type`, the `JobPostPosition.engagement.type` must be matching
- On creation, the `status.current` is always `Awaiting Approval`, and `status.cancellation` is always `null`


---

TODO: get some more clarity on `ManagedProjects`
