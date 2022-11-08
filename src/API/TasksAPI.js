const Notify = require('../models/Notify');
const Tasks=require('../models/Tasks');
const TaskAPI={
    getNotify:async(username)=>{
        return await Notify.find({author:username})
        .then(notifies=>{
            if(notifies)
            {   
                let data= notifies.map(notify=>{
                    let edit=""
                    if(notify.editor==''){
                        edit=notify.author
                    }
                    else{
                        edit=notify.editor
                    }
                    return {
                        taskid:notify.taskid,
                        author:notify.author,
                        date:notify.date.getDate()+'/'
                            +(notify.date.getMonth()+1)
                            +'/'+notify.date.getFullYear()+' '
                            +notify.date.getHours()+':'
                            +notify.date.getMinutes(),
                        editor:edit,
                        Notify:notify.Notify,
                    }
                })
                // console.log(data)
                return data
            }
        })
    },
    editVersion:async(taskid,editor,author,oldValue,newValue)=>{
        const getDifference = (a, b) => 
        Object.fromEntries(Object.entries(b).
        filter(([key, val]) => 
        key in a && a[key] !== val));
        const c = getDifference(oldValue,newValue);
        const notifyID=editor+new Date()//notice
        Notify.findOne({notifyID:notifyID}).then(notify=>{
            let update=''
            if(editor==''){update=author}
            else{
                update=editor
            }
            if(notify)
            {
                console.log("notify exists")
            }
            var newNotify={
                notifyID:notifyID,
                username:author,
                editor:update,
                author:author,
                taskid:taskid,
                Notify:JSON.stringify(c),
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
                var updateID=oldID.split('<')
                var updateID1=updateID[1].split('>')
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