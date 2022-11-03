const Tasks=require('../models/Tasks')
const TaskAPI={
    // getOne: async (options) => {
    //     if(options.id) {
    //         return await Tasks.findOne({id: options.id}).lean()
    //             .then(task => {
    //                 console.log(task)
    //                 return task;
    //             });
    //     }
    // },
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
    },
}
module.exports = TaskAPI;