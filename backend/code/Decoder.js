function d() {
    for (var i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
    }
}

var name = `Dhiraj`;
var fullName = `${name} ok Govindvira`;

d(fullName.includes("dhiraj"));
d(fullName[0]);
d(fullName[1]);
d(fullName.toUpperCase());