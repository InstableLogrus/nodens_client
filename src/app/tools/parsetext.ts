// parsing pasted text for 

/*

https://www.linkedin.com/jobs/view/4239502669

*/

const r = new RegExp(/^https:\/\/www.linkedin.com\/jobs\/view\/(\d+$)/, "i");


export const checkLinkedin = (url:string) => {
    const result = r.exec(url);
    if (result) {
        console.log("ok: ", result[1])
        return result[1];
    }
    else {
        console.log("not ok: ")
        return null;
    }
}