let totalsolved = 0;
let totalpuzzles = 0;
let totalvariantsolved = 0;
let totalvariantpuzzles = 0;
let totalgeneratedsolved = 0;
let totalgeneratedpuzzles = 0;
let totalvgsolved = 0;
let totalvgpuzzles = 0;
let types = {},
    sorted;

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('token')) {
    document.getElementById("token").value = urlParams.get("token");
    document.getElementById("prefill").style.display = "block";
}

async function load() {
    let puzs;
    try {
        document.getElementById("wrong").style.display = 'block';
        document.getElementById("statsbtn").style.display = 'none';
        document.getElementById("wrong").textContent = 'Please wait a moment...';
        let token = "Bearer " + document.getElementById('token').value.trim().replaceAll(/[^.A-Za-z0-9_\-]/g, "");
        puzs = (await (await (fetch(`https://puzz.link/db/api/pzvs_user?limit=999999&order=sort_key.asc&tags_filter=cs.%7B%7D&tags_filter=not.cs.%7Bbroken%7D`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": `${token}`,
                "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
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
            if (types[p.type] == undefined) {
                types[p.type] = {};
                types[p.type]['total'] = 0;
                types[p.type]['solved'] = 0;
                types[p.type]['variantsolved'] = 0;
                types[p.type]['varianttotal'] = 0;
                types[p.type]['generatedtotal'] = 0;
                types[p.type]['generatedsolved'] = 0;
                types[p.type]['vgtotal'] = 0;
                types[p.type]['vgsolved'] = 0;
            }
            if (p.tags_filter.includes('variant') && p.generated) {
                if (p.solved) {
                    types[p.type]['vgsolved'] += 1;
                    totalvgsolved++;
                }
                types[p.type]['vgtotal'] += 1;
                totalvgpuzzles++;
            }
            if (p.tags_filter.includes('variant')) {
                if (p.solved) {
                    types[p.type]['variantsolved'] += 1;
                    totalvariantsolved++;
                }
                types[p.type]['varianttotal'] += 1;
                totalvariantpuzzles++;
            } else if (p.generated) {
                if (p.solved) {
                    types[p.type]['generatedsolved'] += 1;
                    totalgeneratedsolved++;
                }
                types[p.type]['generatedtotal'] += 1;
                totalgeneratedpuzzles++;
            } else {
                if (p.solved) {
                    types[p.type]['solved'] += 1;
                    totalsolved++;
                }
                types[p.type]['total'] += 1;
                totalpuzzles++;
            }
        }

        sorted = Object.keys(types).sort().reduce((acc, currValue) => {
            acc[currValue] = types[currValue];
            return acc;
        }, {});

        document.getElementById("wrong").textContent = 'Done! (Scroll down)';
        let body = document.getElementsByTagName("body")[0];
        let div = document.getElementsByClassName("listing")[0];
        if (div == undefined) {
            div = document.createElement("div");
            div.classList.add("listing");
        }
        let cleared = 0;
        innerhtml = `<div class="box"><p>Include: 
        <label><input type="checkbox" name="puzzletype" value="generated" onclick="update()" id="gen">Generated</label>
        <label><input type="checkbox" name="puzzletype" value="variant" onclick="update()" id="var">Variant</label>
        </p>
        
        <p style="margin-bottom: 5px">Total: <span id="totalsolved">${totalsolved}</span> / <span id="totalpuzzles">${totalpuzzles}</span></p>
        <p style="margin-top: 0px">Clears 💯: <span id="cleared"></span> / <span>${Object.keys(types).length}</span></p>
        <table><tr><th>Genre</th><th>Solves</th><th>Total</th><th>Remaining</th><th>Completed %</th></tr>`;
        for (const type in sorted) {
            innerhtml += `<tr><td style="padding-right: 15px;">${type}</td><td style="padding: 0 15px;" id="${type}solved">${types[type]['solved']}</td><td style="padding: 0 15px;"id="${type}total">${types[type]['total']}</td><td style="padding: 0 15px;"id="${type}remaining">${types[type]['total'] - types[type]['solved']}</td><td style="padding: 0 15px;" id="${type}percent">${types[type]['solved'] == types[type]['total'] || types[type]['total'] == 0 ? "💯<span style='color: gray; font-size: 0.6em'>&nbsp;%</span>" : Math.round(10000 * types[type]['solved'] / types[type]['total']) / 100+"<span style='color: gray; font-size: 0.6em'>&nbsp;%</span>"}</td></tr>`;
            if (types[type]['solved'] == types[type]['total']) {
                cleared++;
            }
        }
        innerhtml += "</table></div>"
        div.innerHTML = innerhtml;
        body.appendChild(div);
        document.getElementById("cleared").textContent = cleared;
        window.scrollBy({
            top: 200,
            left: 0,
            behavior: "smooth",
        });
    } catch (error) {
        document.getElementById("wrong").textContent = 'Something went wrong. Double check your token?';
        document.getElementById("statsbtn").style.display = 'block';
        console.log(error);
        return;
    }
}


function update() {
    let variant = document.getElementById("var").checked;
    let generated = document.getElementById("gen").checked;
    if (variant && generated) {
        document.getElementById("totalsolved").textContent = totalsolved + totalvariantsolved + totalgeneratedsolved - totalvgsolved;
        document.getElementById("totalpuzzles").textContent = totalpuzzles + totalvariantpuzzles + totalgeneratedpuzzles - totalvgpuzzles;
    } else if (variant) {
        document.getElementById("totalsolved").textContent = totalsolved + totalvariantsolved;
        document.getElementById("totalpuzzles").textContent = totalpuzzles + totalvariantpuzzles;
    } else if (generated) {
        document.getElementById("totalsolved").textContent = totalsolved + totalgeneratedsolved;
        document.getElementById("totalpuzzles").textContent = totalpuzzles + totalgeneratedpuzzles;
    } else {
        document.getElementById("totalsolved").textContent = totalsolved;
        document.getElementById("totalpuzzles").textContent = totalpuzzles;
    }
    let cleared = 0;
    for (const type in sorted) {
        let solved, total, remaining;
        if (variant && generated) {
            solved = types[type]['solved'] + types[type]['generatedsolved'] + types[type]['variantsolved'] - types[type]['vgsolved'];
            total = types[type]['total'] + types[type]['generatedtotal'] + types[type]['varianttotal'] - types[type]['vgtotal'];
        } else if (variant) {
            solved = types[type]['solved'] + types[type]['variantsolved'];
            total = types[type]['total'] + types[type]['varianttotal'];
        } else if (generated) {
            solved = types[type]['solved'] + types[type]['generatedsolved'];
            total = types[type]['total'] + types[type]['generatedtotal'];
        } else {
            solved = types[type]['solved'];
            total = types[type]['total'];
        }
        remaining = total - solved;
        document.getElementById(type + "solved").textContent = solved;
        document.getElementById(type + "total").textContent = total;
        document.getElementById(type + "remaining").textContent = remaining;
        document.getElementById(type + "percent").innerHTML = solved == total ? "💯<span style='color: gray; font-size: 0.6em'>&nbsp;%</span>" : Math.round(10000 * solved / total) / 100 + "<span style='color: gray; font-size: 0.6em'>&nbsp;%</span>"
        if (solved == total) {
            cleared++;
        }
    }
    document.getElementById("cleared").textContent = cleared;
}