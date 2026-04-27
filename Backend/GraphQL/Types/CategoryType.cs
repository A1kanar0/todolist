using Backend.Entities;

namespace Backend.GraphQL.Types;

public class CategoryType : ObjectType<Category>
{
    protected override void Configure(IObjectTypeDescriptor<Category> descriptor)
    {
        descriptor.Field(x => x.Id).Type<NonNullType<IntType>>();
        descriptor.Field(x => x.Name).Type<NonNullType<StringType>>();
    }
}
