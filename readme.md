# **TODO APP README**

## **TODO Application**

TODO Application is an application to manage your tasks.

## **Sample screenshots** ##

### **Main view app** ###

![normal_view.PNG](client/todo_app/src/assets/image/normal_view.PNG)

### **View app with description** ###

![description_view.png](client/todo_app/src/assets/image/description_view.png)

## **Introduction**
Created this project was purpose main learned Angular, TypeScript, PL/SQL.

This project is useful to manage tasks.

- [x] App has searched all tasks from database.
- [x] we can ADD new task.
- [x] we can UPDATE added task ( change description, status or finish date).
- [x] we can delete task.

In **plsql file** is code from TODO base. I created there:

- sequence for increment id;
- procedures for:

    - add task
    - update task
    - delete task
    - update status task
  - **Procedure for check task status is called by DBMS_SCHEDULER 'check_task_status'** -> this job check every day about 23:59 that 
  status each task with finish date equal current day is "DONE", If not change on status "DONE".

### **Examples possibly tasks to add this project**
- [ ] Group task by status
- [ ] add subtask to main task
- [ ] delete for a few tasks

## **Technologies**

* Angular 19
* Angular material 19
* rxjs
* Typescript
* Java 21
* Oracle

## **Installation**

To install TODO Application, follow these steps:

1. Clone the repository: **`git clone https://github.com/daisygith/todo_app.git`**
2. Navigate to the project directory: **`cd todo_app`**
3. Database import
    - Run **plsql/todo.sql** in Oracle database
4. Client
   - Navigate to the client directory: **`cd client/todo_app`**
   - Install dependencies: **`npm install`**
   - Start the project: **`npm start`**
5. Server
   - Navigate to the server directory: **`cd server`**
   - Install dependencies: **`npm install`**
     - Configure connection to database in **db.js**
       ```
         const config = {
           user: "todo",
           password: "todo123",
           connectString: "localhost:1521/FREEPDB1",
         };
       ```
   - Start the project: **`npm dev`**



## **Authors**

TODO APP was created by **[Sylwia](https://github.com/daisygith)**.

