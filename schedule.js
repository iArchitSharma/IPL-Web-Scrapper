const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');


const schedule = [];

const url = "https://www.sportskeeda.com/go/ipl/schedule?ref=carousel";
request(url,(error,response,html)=>{

    if(!error&&response.statusCode==200){
        const $ = cheerio.load(html);

        let date = [];
        let time = [];
        let match = [];
        let venue = [];
        let teamLeft = [];
        let teamRight = [];
        //Loop and Scrap
        $('.keeda_cricket_event_card').each((i,el)=>{
            //To get Date and Time
            day = $(el).find('.keeda_cricket_event_date').text().trim().replace(/\s\s+/g,'-');
            let indexDay = day.indexOf('-');
            time[i] = day.slice(indexDay+1).trim();
            date[i] = day.substring(0, indexDay).trim();
            //To get venue and match
            let full = $(el).find('.keeda_cricket_venue').text().replace(/\n/g, " ");
            let indexFull = full.indexOf(',');
            venue[i] = full.slice(indexFull+1).trim();
            match[i] = full.substring(0, indexFull);
            //To find left and Right teams
            teams = $(el).find('.keeda_cricket_team_name').text().trim().replace(/\s\s+/g,'-');
            let indexTeam = teams.indexOf('-');
            teamLeft[i] = teams.substring(0, indexTeam).trim();
            teamRight[i] = teams.slice(indexTeam+1).trim();
            
        });
        //Store data in object and push to array
        for (let i =0;i<match.length;i++){
            const cards = {id:'', date:'', time:'', match:'', venue:'', teamLeft:'', teamRight:''};

            cards.id = i;
            cards.date = date[i];
            cards.time = time[i];
            cards.match = match[i];
            cards.venue = venue[i];
            cards.teamLeft = teamLeft[i];
            cards.teamRight = teamRight[i];


            schedule.push(cards);

            
        }
        //Write Data to JSON File
        fs.writeFile('./Data/schedule.json', JSON.stringify(schedule, null, 2), (error) => {
            if (error) {
              console.log(error)
              return
            }
            console.log('Website data has been scrapped.')
          })
        

        console.log(date[2]+" "+time[2]+" "+match[2]+" "+venue[2]+" "+teamRight[2]);
    }
});