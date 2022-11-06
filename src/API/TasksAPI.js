const Notify = require('../models/Notify');
const Tasks=require('../models/Tasks')
const TaskAPI={
    editVersion:async(taskid,editor,author,oldValue,newValue)=>{
        //const today=new Date()
        const getDifference = (a, b) => 
        Object.fromEntries(Object.entries(b).
        filter(([key, val]) => 
        key in a && a[key] !== val));
        const c = getDifference(oldValue,newValue);
        const notifyID=editor+new Date()//notice
        Notify.findOne({notifyID:notifyID}).then(notify=>{
            if(notify)
            {
                console.log("notify exists")
            }
            var newNotify={
                notifyID:notifyID,
                username:author,
                editor:editor,
                author:author,
                taskid:taskid,
                Notify:c,
            }
            new Notify(newNotify).save()
        })
        var data={
            date:new Date(),
            Notify:c,
            editor:editor,
            author:author,
        }
        console.log(data)
        return data
    },
    update: async (data) => {
        return await Tasks.findByIdAndUpdate(id, {$set: data});
    },
    editAuthor:async(oldAuthor,newAuthor)=>{
        Tasks.find({author:oldAuthor})
        .then(tasks=>{
            tasks.map(task=>{
                var oldID=task.id
                // console.log(oldID)
                var updateID=oldID.split('<')
                // console.log(updateID)
                var updateID1=updateID[1].split('>')
                // console.log(updateID1)
                // console.log(updateID[0])
                // console.log(updateID[0]+"<"+updateID1[0]+">")
                task.id=updateID[0]+"<"+newAuthor+">",
                task.author=newAuthor,
                task.deadline=task.deadline,
                task.title=task.title,
                task.description=task.description,
                task.isFinished=task.isFinished,
                task.gid=task.gid,
                task.save()
            })
        })
        // getOne: async (options) => {
    //     if(options.id) {
    //         return await Tasks.findOne({id: options.id}).lean()
    //             .then(task => {
    //                 console.log(task)
    //                 return task;
    //             });
    //     }
    // },
    },
}
module.exports = TaskAPI;