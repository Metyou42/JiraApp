# JIRA APP

Web application for obtaining data about tasks from the Jira Cloud. List their numbers in the form of a table as a page in the browser.

- Connects to Jira Cloud via Jira Connect
- Uses Jira REST Api 3
- The web application is hosted on AWS

## Features

- It is possible to select a display filter that was previously created on Jira Cloud
- The column on the left shows the users who are assigned to perform the task. The first row at the top of the table presents a list of statuses in the form of their sequence during the task (Workflow) from initial (Open) to completed or executed (Closed).
- In the cells at the intersection of statuses and users are data on the number of tasks that are in the appropriate status and performed by the employee. References from this number should lead to Jira Cloud displayed by standard means


## Hosted

- Downloaded to the created Amazon Web Service EC2 (access) instance (t2.micro) under Linux (Ubunte 20.x)
- Used Pm2 & Nginx