const fs= require("fs").promises;
const path = require("path");
const readline=require("readline");

const filepath=path.join(__dirname,"task.txt");

const getInput=(question)=>{
    const rl=readline.createInterface({
        input:process.stdin,
        output:process.stdout
    });
    return new Promise((resolve,reject)=>{
        rl.question(question,(answer)=>{
            resolve(answer);
            rl.close();
        })
        
    })
}
const addTask=async()=>{
    try{
        const task=await getInput("Enter task: ");
        try{
            await fs.access(filepath);
            const fileContent=await fs.readFile(filepath,"utf-8");

            if(fileContent.trim()===""){ 
                await fs.writeFile(filepath,task);  
            } 
            else{
                await fs.appendFile(filepath,"\n"+task);
            }
        }
        catch{
            await fs.writeFile(filepath,task);
        }
        finally{
            console.log("Task added successfully- Thankyou...");
            
        }
    }
    catch(err){
        console.log(err);
    }
}
const viewAll=async()=>{
    try{
        const fileContent=await fs.readFile(filepath,"utf-8");
        const data=fileContent.split("\n");
        return data;
    }
    catch(err){
        console.log(err);
    }
}
const markAsDone=async()=>{
    try {
        const data = await viewAll();

        if(data.length === 1 && data[0].trim() === "") {
            console.log("\nNo Tasks Added Yet\n");
            return;
        }
        console.log("\nYour tasks are: ");
        data.map((line, idx) => {
            console.log(`(${idx + 1}) ${line}`);
        });

        const idx = Number(
            await getInput("Enter the task number you want to mark as read: ")
        );
        if(isNaN(idx) || idx < 1 || idx > data.length) {
            console.log("Invalid task index. Please enter a valid number.");
            return;
        }

        data[idx - 1] = [`${data[idx - 1]}`];
        await fs.writeFile(filepath, data.join("\n"));

        console.log("Task marked as completed.");
    } catch (error) {
        console.error(error);
    }

}
const deleteTask=async()=>{
    try {
        const data = await viewAll();

        if(data.length === 1 && data[0].trim() === "") {
            console.log("\nNo Tasks Added Yet\n");
            return;
        }
        console.log("\nYour tasks are: ");
        data.map((line, idx) => {
            console.log(`${idx + 1}. ${line}`);
        });

        const idx = Number(
            await getInput("Enter the task number you want to remove: ")
        );
        if(isNaN(idx) || idx < 1 || idx > data.length) {
            console.log("Invalid task index. Please enter a valid number.");
            return;
        }

        const newTask = data.filter((_, index) => index !== idx - 1);
        await fs.writeFile(filepath, newTask.join("\n"));

        console.log("Task Removed.");
    } catch (error) {
        console.error(error);
    }

}
async function main(){
    while(true){
        console.log("\n1.Add a task");
        console.log("2.view all tasks");
        console.log("3. Mark as done");
        console.log("4. Delete a task");
        console.log("5. Exit");

        const choice=await getInput("Choose option: ");
        console.log(choice); 

        switch(choice){
            case "1":
                await addTask();
                break;
            case "2":
                const data=await viewAll();
                console.log(data.join("\n"));
                
                break;
            case "3":
                await markAsDone();
                break;
            case "4":
                await deleteTask();
                break;
            case "5":
                process.exit(0);
                break;
            default:
                console.log("Invalid choice");
                break;
        }
    }
}
main();

