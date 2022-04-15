const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');


const table = [];

const url = "https://www.sportskeeda.com/go/ipl/points-table?ref=carousel";
request(url,(error,response,html)=>{

    if(!error&&response.statusCode==200){
        const $ = cheerio.load(html);

        let position;
        let overallPoints;
        let team;

        //For loop starts
        for(let i=1;i<=10;i++){
            let pt = `.points_table_${i}`;
            //Loop and Scrap
        $(pt).each((j,el)=>{
            //To get position 
            position = i;
            //To get Qualification check
            overallPoints = $(el).find('.overall-points').text();
            //To get name of team
            team = $(el).find('.points-table-team-name').text().trim();
            
            const points = {id:'', position:'', overallPoints:'', team:''};

            points.id = i;
            points.position = position;
            points.overallPoints = overallPoints;
            points.team = team;


            table.push(points);
            
        });
        }//For loops end
        
        //Store data in object and push to array
        /*for (let i =0;i<position.length;i++){
            const points = {id:'', position:'', overallPoints:'', team:''};

            points.id = i;
            points.position = position[i];
            points.overallPoints = overallPoints[i];
            points.team = team[i];


            table.push(points);

            
        }*/
        //Write Data to JSON File
        fs.writeFile('./Data/pointsTable.json', JSON.stringify(table, null, 2), (error) => {
            if (error) {
              console.log(error)
              return
            }
            console.log('Website data has been scrapped.')
          })
        

        //console.log(date[2]+" "+time[2]+" "+match[2]+" "+venue[2]+" "+teamRight[2]);
    }
});