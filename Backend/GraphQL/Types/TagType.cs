
namespace Backend.GraphQL.Types;

public class TagType : ObjectType<Backend.Entities.Tag>
{
    protected override void Configure(IObjectTypeDescriptor<Backend.Entities.Tag> descriptor)
    {
        descriptor.Field(x => x.Id).Type<NonNullType<IntType>>();
        descriptor.Field(x => x.Name).Type<NonNullType<StringType>>();
        descriptor.Field(x => x.Color).Type<NonNullType<StringType>>();
    }
}
