extend type User @exclude @auth (rules: [
       {operations: [CREATE,CONNECT, DISCONNECT], roles: ["zadmin", "admin"]},
       {operations: [UPDATE, READ, DELETE],
          OR: [{ roles: ["zadmin", "admin"] }, { allow: { id: "$jwt.sub" } }]}
    ])

@auth(rules: [{roles: ["zadmin", "admin"]}])

@auth(rules: [{roles: ["zadmin", "admin"]}])
