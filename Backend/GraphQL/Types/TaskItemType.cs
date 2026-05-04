using Backend.Entities;
using Backend.Services;

namespace Backend.GraphQL.Types;

public class TaskItemType : ObjectType<TaskItem>
{
    protected override void Configure(IObjectTypeDescriptor<TaskItem> descriptor)
    {
        descriptor.Field(t => t.Id).Type<NonNullType<IdType>>();
        descriptor.Field(t => t.Title).Type<NonNullType<StringType>>();
        descriptor.Field(t => t.Content).Type<StringType>();
        descriptor.Field(t => t.CategoryId).Type<IntType>();
        descriptor.Field(t => t.ParentId).Type<IntType>();
        descriptor.Field(t => t.IsCompleted).Type<NonNullType<BooleanType>>();
        descriptor.Field(t => t.CreatedAt).Type<NonNullType<DateTimeType>>();
        descriptor.Field(t => t.Deadline).Type<DateTimeType>();
        
        descriptor.Field(t => t.Images)
            .Type<ListType<ObjectType<TaskImage>>>()
            .Resolve(async ctx =>
            {
                var task = ctx.Parent<TaskItem>();
                var service = ctx.Service<ITaskImageService>();
                return await service.GetImagesByTaskIdAsync(task.Id);
            });

        descriptor.Field("executors")
            .Type<ListType<UserType>>() 
            .Resolve(async ctx =>
            {
                var task = ctx.Parent<TaskItem>();
                var userService = ctx.Service<IUserService>(); 
                return await userService.GetUsersByTaskIdAsync(task.Id);
            });
    }
}
