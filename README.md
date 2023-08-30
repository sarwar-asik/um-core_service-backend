#### api endpoints  :::::


##### used backend technology :::


            PostgresSQL (database),

            Prisma,
            TypeScript,
            Express,
            dotenv


            Husky,
            EsLint,
            EsLint Prettier,
            winston,
            ts-node-dev,

            zod(for validation),
            JWT(for authentication) ,

            http-status,
            bcrypt(password hashing),
            

**academic-semester** 

1.  http://localhost:5000/api/v1/academic-semester (post)



in req.body >>>

                {
                  "year": 2023,
                  "title": "Sample Course3",
                  "code": "3",
                  "startMonth": "January",
                  "endMonth": "May"
                }

in headers (example) >>>
    
     
        authorization  : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  



2. get all data with pagination and filters


          http://localhost:5000/api/v1/academic-semester?page=1&limit=5&sortBy=asc&title=Course1 (GET)


3. get single data by id ::

           http://localhost:5000/api/v1/academic-semester/19c54336-3fb4-4e83-962d-abcdd4d42cb2 (GET)



**academic-faculty**

1. create data 

http://localhost:5000/api/v1/academic-faculty(POST)

in req.body

      {
          "title":"academic-faculty3"
      }

in headers (example) >>>
    
     
        authorization  : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  


2. get all data with pagination and filters


          http://localhost:5000/api/v1/academic-faculty?page=1&limit=5&sortBy=asc&title=Course1 (GET)


3. get single data by id ::

          http://localhost:5000/api/v1/academic-faculty/19c54336-3fb4-4e83-962d-abcdd4d42cb2 (GET)



**academic-department**


1. create data 

http://localhost:5000/api/v1/academic-department(POST)

in req.body

    {
    "title":"academic-department2",
    "academicFacultyId":"63bf22f8-40d0-425b-b8dc-f8d86e65d515"
      }

in headers (example) >>>
    
     
        authorization  : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  

2. get all data with pagination and filters


          http://localhost:5000/api/v1/academic-department?page=1&limit=5&sortBy=asc&title=Course1 (GET)


3. get single data by id ::

        http://localhost:5000/api/v1/academic-department/19c54336-3fb4-4e83-962d-abcdd4d42cb2 (GET)





**student**


1. create data 

http://localhost:5000/api/v1/students/(POST)

in req.body >>>

                        {
                      "studentID": "22222",
                      "firstName": "John",
                      "lastName": "Doe",
                      "middleName": "M",
                      "profileImage": "profile.jpg",
                      "email": "john.doe@example.com",
                      "contactNo": "1234567890",
                      "gendar": "Male",
                      "bloodGroup": "A+",
                      "academicSemestarId": "b5b9c7f8-a485-41f4-878f-503b0ec640ea",
                      "academicDepartmentId": "49eee978-4b24-4120-9a0b-e6ab74a2cc11",
                      "academicFacultyId": "84d88768-cb8a-443e-b148-b5c42758cc7b"
                    }

in headers (example) >>>
    
     
        authorization  : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  

2. get all data with pagination and filters


          http://localhost:5000/api/v1/students?page=1&limit=5&sortBy=asc&title=Course1 (GET)


3. get single data by id ::

           http://localhost:5000/api/v1/students/19c54336-3fb4-4e83-962d-abcdd4d42cb2 (GET)



**building**


1. create data 



http://localhost:5000/api/v1/buildings/(POST)


in req.body

       {
    "title":"building1"
    }

in headers (example) >>>
    
     
        authorization  : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  

2. get all data with pagination and filters


        http://localhost:5000/api/v1/buildings?page=1&limit=5&sortBy=asc&title=Course1 (GET)


3. get single data by id ::

          http://localhost:5000/api/v1/buildings/19c54336-3fb4-4e83-962d-abcdd4d42cb2 (GET)



**room**


1. create data  (jwt verified)

http://localhost:5000/api/v1/rooms/(POST)

 in req.body >>

     {
    "roomNumber":"03",
    "floor":"01",
    "buildingId":"cf4ccadf-ab8f-45ea-9f3d-cbd5eb864887"
    }

in headers (example) >>>
    
     
        authorization  : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  

2. get all data with pagination and filters


          http://localhost:5000/api/v1/rooms?page=1&limit=5&sortBy=asc&title=Course1 (GET)


3. get single data by id ::

          http://localhost:5000/api/v1/rooms/19c54336-3fb4-4e83-962d-abcdd4d42cb2 (GET)
          

**courses**


1. create data (jwt verified)

in req.body >>>

http://localhost:5000/api/v1/courses/(POST)


    {
    "title":"course4",
    "code":"4444",
    "credits":9
  }

in headers (example) >>>
    
     
        authorization  : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  

2. get all data with pagination and filters ;


         http://localhost:5000/api/v1/courses?page=1&limit=5&sortBy=asc&title=Course1 (GET)


3. get single data by id ::

          http://localhost:5000/api/v1/courses/19c54336-3fb4-4e83-962d-abcdd4d42cb2 (GET)
4. update course data by id ::

          http://localhost:5000/api/v1/courses/19c54336-3fb4-4e83-962d-abcdd4d42cb2 (PUT)


In req.body >>>>

                {
                "title": "course6",
                "code": "666666",
                "Prerequisite": [
                        {
                        "courseID": "dd619c9c-8fd9-4211-a8cf-9194c5175817",
                        "isDeleted": true
                        },
                        {
                        "courseID": "cafe9117-eee4-49c4-8199-9ed615ccc46e",
                        "isDeleted": true
                        },
                        {
                        "courseID": "83cffb47-d1cd-4b92-a0d3-d9ad40c3473c",
                        "isDeleted": false
                        }
                ]
                }

**courses-faculty**


1. create data (jwt verified)

in req.body >>>

http://localhost:5000/api/v1/courses/c67ce94d-6e44-4508-9a1d-8a1677d338f8/remove-faculties(POST)


        {
        "faculties":[
                "97e221c1-dcf2-4eef-9fd9-9c1ddca581ad",
                "454e221c1-dcf2-4eef-9fd9-9c1ddca581da"
        ]
        }

in headers (example) >>>
    
     
        authorization  : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 
3. delete single data by id ::

          http://localhost:5000/api/v1/courses/c67ce94d-6e44-4508-9a1d-8a1677d338f8/remove-faculties(DELETE)


In req?.body >>>>

                {
                "faculties":[
                        "97e221c1-dcf2-4eef-9fd9-9c1ddca581ad"
                ]
                }





# University Management Core Service
This guide will walk you through the process of setting up the University Management Core Service Starter project. By following these steps, you will clone the project, install dependencies, and configure Prisma for database management. Let's get started!


## Installation Steps
### Follow these steps to clone and set up starter project:

1. `Clone the project:` Open your terminal or command prompt and run the following command to clone the project repository:

```bash
git clone https://github.com/Programming-Hero-Next-Level-Development/university-management-core-service-starter.git university-management-core-service
```

2. `Navigate into the project directory:` Use the cd command to navigate into the project directory:

```bash
cd university-management-core-service
```

3. `Install project dependencies:` Next, install the project dependencies by running the following command:

```bash
yarn install
```

4. Configure Prisma and the database connection:

- Add Prisma as a development dependency by running the following command:
```bash
yarn add prisma --save-dev
```

- Set up your Prisma project by creating the Prisma schema file using the following command:
```bash
npx prisma init
```

- Open the prisma/schema.prisma file and configure your database connection details.

```bash
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

- Create a .env file in the project root directory and set the DATABASE_URL environment variable. Replace the placeholders with your database connection details:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
```

5. Creating the database schema
6. Migrate the database schema: Use the following command to create and apply the initial database schema:

```bash
npx prisma migrate dev --name init
```
This command creates a new migration file based on your schema changes and applies it to your database.

6. `Install Prisma Client:` Install the Prisma Client library by running the following command:
```bash
yarn add @prisma/client
```

This command installs the Prisma Client, which provides an interface to interact with your database.

That's it! You have successfully set up the University Management Core Service Starter project. You can now start exploring and working with the codebase. Refer to the project documentation or README for further instructions on how to run and use the core service.

Happy coding!