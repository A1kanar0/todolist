using HotChocolate.Types;
using Backend.Entities;

namespace Backend.GraphQL.Types;

public class UserType : ObjectType<User>
{
    protected override void Configure(IObjectTypeDescriptor<User> descriptor)
    {
        descriptor.Field(x => x.Id).Type<NonNullType<IntType>>();
        descriptor.Field(x => x.Username).Type<NonNullType<StringType>>();
        descriptor.Field(x => x.Email).Type<NonNullType<StringType>>();

        descriptor.Field(x => x.PasswordHash).Ignore();
        descriptor.Field(x => x.IsDeleted).Ignore();
    }
}
