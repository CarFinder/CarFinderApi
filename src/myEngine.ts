import { InterfacePerson } from "./interfaces";

export const makeHTML = (data: InterfacePerson[]) => {
    let html: string = "";
    data.forEach(item => {
        html =
            html +
            `
            <div>
                <p>Name: ${item.name} </p>
                <p>Role : ${item.role} </p>
                <p>Current Project : ${item.project} </p>
                <p>Age: ${item.age} </p>
            </div>
        `;
    });
    return (
        html +
        `
        <p> Full Data: ${data} </p>
    `
    );
};
