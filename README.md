# ChaggarCharts

React app with ASP.NET Core backend proving a platform to submit and rate songs while tracking their statistics.

## Table of Contents

- [Introduction](#introduction)
- [Technologies](#technologies)
- [Installation](#installation)

## Introduction

Music rating app, with songs submitted by users and ratings being assigned by admins. Users are able to submit one song from a website of their choice
once per day with the rating being hidden until all songs have been judged. Statistics on each user's metrics are provided in charts and on a platform wide leaderboard
to show items such as total days won or highest average rating.

## Technologies

ChaggarCharts is created using:

Frontend:

- React version: 16.13.1
- Material UI version: 15.0.0
- Recharts version: 2.1.6
- React Router version: 5.1.2
- React Query version: 3.24.2

Backend:

- ASP.NET Core version: 5.6.3
- Entity Framework version: 5.0.9
- AutoMapper version: 8.1.1

## Installation

To run this project locally in a development environment:

```
Create database using chaggarcharts.sql script
Load connection string into appsettings.json file and store in ChaggarCharts.API folder

$ cd ChaggarCharts.API
$ dotnet restore
$ dotnet ChaggarCharts.API.dll

$ cd ..
$ cd ChaggarCharts.Web
$ yarn install
$ yarn dev:start
```
