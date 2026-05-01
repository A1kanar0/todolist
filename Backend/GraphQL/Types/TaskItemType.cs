using Backend.Entities;

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
    }
}
