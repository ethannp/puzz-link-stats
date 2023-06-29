try {
    let types = {};
    let choosing = [];
    let htmltypes = document.getElementsByClassName("typesel")[0].children;
    for (const label in htmltypes) {
        let input = htmltypes[label].children;
        if (input != undefined) {
            let typename = htmltypes[label].textContent;
            if (input[0].checked) {
                choosing.push(htmltypes[label].textContent);
            }
            types[typename] = {};
            types[typename]['total'] = 0;
            types[typename]['solved'] = 0;
        }
    }
    let str = "";
    if (choosing.length !== 0) {
        let genres = "";
        for (const pt in choosing) {
            genres += '"' + choosing[pt] + '"%2C';
        }
        genres = genres.slice(0, -3);
        str = '&type=in.(' + genres + ')';
    }

    let puzs = (await (await (fetch('https://puzz.link/db/api/pzvs_user?' + str + 'limit=999999&order=sort_key.asc&generated=eq.false&tags_filter=cs.%7B%7D&tags_filter=not.cs.%7Bbroken%7D&tags_filter=not.cs.%7Bvariant%7D', {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": "Bearer " + localStorage.getItem("token"),
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }))).json());

    for (const pz in puzs) {
        let p = puzs[pz];
        if (types[p.type] != undefined) {
            if (p.solved) {
                types[p.type]['solved'] += 1;
            }
            types[p.type]['total'] += 1;
        }
    }

    let body = document.getElementsByTagName("body")[0];
    let div = document.getElementsByClassName("listing")[0];
    if (div == undefined) {
        div = document.createElement("div");
        div.classList.add("listing");
    }
    innerhtml = "<div><label><input type='checkbox' value='hidecomplete' id='hidecomplete'>Hide completed genres</label>&nbsp;|&nbsp;<a href='https://ethannp.github.io/puzz-link-stats/index.html?token=" + localStorage.getItem("token") + "' target='_blank'>See full stats</a><table><tr><th>Genre</th><th>Solves</th><th>Total</th><th>Remaining</th></tr>";
    for (const type in types) {
        if (types[type]['total'] != 0) {
            innerhtml += '<tr><td style="padding-right: 15px;">' + type.toString() + '</td><td style="padding: 0 15px;">' + types[type]['solved'].toString() + '</td><td style="padding: 0 15px;">' + types[type]['total'].toString() + '</td><td style="padding: 0 15px;">' + (types[type]['total'] - types[type]['solved']).toString() + '</td></tr>';
        }
    }
    innerhtml += "</table></div>"
    div.innerHTML = innerhtml;
    div.style = "position: absolute; top: 10px; left: 0.5em; "
    body.appendChild(div);
    body.style.marginTop = (10 + div.offsetHeight) + "px";
    let checkbox = document.getElementById("hidecomplete");
    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            localStorage.setItem("hide-checked", "true");
        } else {
            localStorage.setItem("hide-checked", "false");
        }
        let rows = div.firstChild.lastChild.firstChild.children;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].children[3].textContent == 0) {
                if (checkbox.checked) {
                    rows[i].style.display = "none";
                } else {
                    rows[i].style.display = "table-row";
                }
            }
        }
        body.style.marginTop = (10 + div.offsetHeight) + "px";
    });
    let hide = localStorage.getItem("hide-checked");
    if (hide != undefined && hide == "true") {
        checkbox.checked = true;
        let rows = div.firstChild.lastChild.firstChild.children;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].children[3].textContent == 0) {
                if (checkbox.checked) {
                    rows[i].style.display = "none";
                } else {
                    rows[i].style.display = "table-row";
                }
            }
        }
        body.style.marginTop = (10 + div.offsetHeight) + "px";
    }
} catch (err) {
    alert('Something went wrong.');
}