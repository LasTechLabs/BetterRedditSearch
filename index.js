//set up search_type_button clicking display logic
let searchTypeButtons = document.getElementsByClassName('search_type_button')
Array.from(searchTypeButtons).forEach(button=>{
    button.addEventListener('click', e => {
        Array.from(searchTypeButtons).forEach(btn =>{
            btn.classList = "search_type_button"
            if(btn.id === e.target.id){
                btn.classList.add('selected')
            }
        })
    })
})

//set up search_button click logic
document.getElementById('search_button').addEventListener('click', (e)=>{
    let filtered_values = Array.from(document.getElementsByTagName('input'))
    let search_type = document.getElementsByClassName("search_type_button selected")[0].id
    let result_array = filtered_values.map((val)=>{return sanitiseArray(val, search_type)})

    let searchTerm = ""

    for(let i = 0; i < result_array.length; i++){
        if( i === 3 || i === 4 || i === 5){
            searchTerm = searchTerm.concat(" " + result_array[i]).trim()
        }else if(i === 6 || i === 7){
            if(i === 6 && result_array[6] != ""){
                searchTerm = searchTerm.concat("&tbs=cdr:1,cd_min:" + result_array[i]).trim()
            }else if(i === 7 && result_array[6] == "" && result_array[7] != ""){
                searchTerm = searchTerm.concat("&tbs=cdr:1,cd_max:" + result_array[i]).trim()
            }else if(i === 7 && result_array[6] != "" && result_array[7] != ""){
                searchTerm = searchTerm.concat(",cd_max:" + result_array[i]).trim()
            }
        }else{
            searchTerm = searchTerm.concat(" " + construct(search_type, result_array[i])).trim()
        }
    }
    searchTerm = searchTerm.split(" ").join("+")
    window.open(`https://www.google.com/search?q=${searchTerm}`, '_blank').focus();
})

//parse the various user inputs from the page into useable strings
const sanitiseArray = (filtered_array_entry, searchTypeString) => {
    let s_type = getSearchType(searchTypeString);

    if (filtered_array_entry.id.includes("any_")) {
        return `${filtered_array_entry.value.trim().replace(/ +(?= )/g, '').split(" ").join(" OR ")}`
    } else if (filtered_array_entry.id.includes("all_")) {
        return `${filtered_array_entry.value.trim().replace(/ +(?= )/g, '').split(" ").join(" AND ")}`
    } else if (filtered_array_entry.id.includes("exact_")) {
        return `"${filtered_array_entry.value.trim().replace(/ +(?= )/g, '')}"`
    } else if (filtered_array_entry.id.includes("none_")) {
        if (filtered_array_entry.value != "") {
            return `${filtered_array_entry.value.trim().replace(/ +(?= )/g, '').split(" ").map(word => { return `-${s_type}${word}` }).join(" ")}`
        } else {
            return ""
        }
    }else if(filtered_array_entry.id.includes("check_")){
        if (filtered_array_entry.value != "") {
            return `${filtered_array_entry.value.trim().replace(/ +(?= )/g, '').split(" ").map(word => { return `site:reddit.com/r/${word}` }).join(" OR ")}`
        } else {
            return "site:reddit.com"
        }
    }else if(filtered_array_entry.id.includes("dont_")){
        if (filtered_array_entry.value != "") {
            return `${filtered_array_entry.value.trim().replace(/ +(?= )/g, '').split(" ").map(word => { return `-site:reddit.com/r/${word}` }).join(" ")}`
        } else {
            return ""
        }
    }else if(filtered_array_entry.id.includes("date_")){
        if (filtered_array_entry.value != "") {
            let dateString = new Date(filtered_array_entry.valueAsNumber)
            let parsedDate = `${dateString.getMonth()+1}/${dateString.getDate()}/${dateString.getFullYear()}`
            return parsedDate
        }else{
            return ""
        }
    }else {
        return ""
    }
}

//creates search substring eg -intitle:dog
const construct = (searchType, word, negate = "") => {
    let s_type = getSearchType(searchType)
    
    if(word != "" && word != '""'){
        return `${negate}${s_type}${word}`
    }else{
        return ""
    }
}

//translates id into intitle/intext or nothing. 
//This SHOULD BE an unnecessary function but I didn't think very far ahead and I'm also very lazy
const getSearchType = (searchType_string) =>{
    if(searchType_string === "search_title"){
        return "intitle:"
    }else if(searchType_string === "search_content"){
        return "intext:"
    }else if(searchType_string === "search_all"){
        return ""
    }
}