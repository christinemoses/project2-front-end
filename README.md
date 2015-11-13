##Front end content for WDI project 2

#Link to Project 2 API Repo:
https://github.com/christinemoses/project2-api

#Link to the live app:


#Wireframes:
I created two wireframes when planning the app.  They helped me to clarify what I wanted the user interaction to be, but I didn't end up having enough time to make the app usable and also fit the visual layout I envisioned.
*Two wireframe images are saved to the project2-front-end/styles/images directory.

This project is a Gift Planning app that allows logged in users to create holidays or events for which they plan to purchase gifts.  For each holiday, they can add recipients who will receive gifts.  For each recipient, users can add gift ideas.

When creating the user stories, I listed all features I would ideally like to have in this type of app, then pared it down to the simplest use case.  I focused solely on completing the minimum functionality to meet that use case, then prioritized the remaining items according to how much they would add to the usability of the app and level of difficulty to achieve.

I was not able to complete any of the stretch goals in the time allotted, but was able to achieve most of the minimum use case functionality.  For minimum use case, the unfinished features I didn't achieve were:
  * Adding delete and update capability to the front end (it's in the back end only)
  * Getting the log out button working
  * Adding more text to clarify usability
  * Using a bootstrap template to make it more attractive and responsive 

##User Stories:

#Cards -
     **roles:

- Holiday gift buyer
- friend/family of holiday gift buyer

    **personas:

- a person who plans to buy holiday gifts for their friends, family, coworkers, etc.

    **epics:
    
*MINIMUM USE CASE:

- create a user account
- returning user log into account
- create a gift list
- populate the gift list with people
- add gift ideas to each person in the list

*STRETCH:

- add an overall holiday gifting budget
- divide the budget across the recipients on the list
- track how much money is spent as gifts are purchased
- add images and shopping links to gift ideas
- share all gift ideas for one holiday with another user
- share all gift ideas for one recipient with another user
- share the gift ideas for one recipient in one holiday with another user
- allow 2 or more users to edit a recipient’s gift ideas
- create calendar notifications to remind users about recipients who don’t have gift purchases completed holiday dates approach
- create calendar notifications to remind user of upcoming birthdays
- add sale calendar notifications to gift ideas
- track which gifts have been wrapped, shipped, received
- add priority ranking for recipients to purchase for
- add priority ranking for gift ideas for a recipient
- add public user profiles
- add chat feature for users to discuss gift ideas
- add gift suggestion features

     #stories:

- As a visitor to the app:
    - I can create an account

- As a registered app user:
    - I can log in
    - I can create/edit/delete recipients
    - I can create/edit/delete holidays
    - I can create/edit/delete gift ideas
    - I can see saved holidays, people and gift ideas
    - I can log out
