/*
Kicsit át lesz alakítva 
- Eddig volt két függvényt, egyikkel lekártük az összes user-t másikkal meg csak egyet id-alapján

van egy olyan gomb, hogy delete, most megcsináljuk arra hogy törölje ki azt amire rákattintunk

- lesz egy pagination, tehát lehet majd lapozni 
- nem ugy lesz, hogy lekérjük a json-ből, hogy mi json.name, json.age 
hanem div-ek helyett, amibe megjelenítjük ezt input mezők lesznek és mi írjuk be, hogy mik legyenek az értékek 

- csinálunk egy updateUser-t is, ami majd egy PUT metódus lesz (ugye ez az updateuser az abból lesz amit beírunk age, name stb.)
fontos, amikor majd bekérjük ezeket a dolgokat, akkor lecsekkoljuk regex alapján, hogy helyesen töltötték ki
pl. itt az email-t lehet jól meg a birthDate-et 

Ez lesz majd a user, a főoldal

    <div class="container">
        <div class="grid-4" id="users-holder"></div>
    </div>

    <div class="pagination">
        <div>
            <button id="prev"></button>
        </div>
        <div>
            <h4 id="page">1-10</h4>
        </div>
        <div>
            <button id="next"></button>
        </div>
    </div>

    <script type="module" src="index.js"></script>

    itt fogunk majd lapozni!!! 

    ez meg a másik oldal, ahonnan bekérjük a dolgokat és updateUser-ezünk 

    <div class="container">
        <a href="/">Index</a>
        <div class="grid-2">
            <div class="box">
                <img id="user-image">
            </div>
            <div class="box">
                <div class="grid-2">
                    <div class="data-box">
                        <h4>First Name</h4>
                        <input type="text" id="first-name">
                    </div>
                    <div class="data-box">
                        <h4>Last Name</h4>
                        <input type="text" id="last-name">
                    </div>
                </div>
                <div class="grid-2">
                    <div class="data-box">
                        <h4>Birth Date</h4>
                        <input type="date" id="birth-date">
                    </div>
                    <div class="data-box">
                        <h4>Age</h4>
                        <input type="number" id="age">
                    </div>
                </div>
                <div class="grid-2">
                    <div class="data-box">
                        <h4>Email</h4>
                        <input type="email" id="email">
                    </div>
                    <div class="data-box">
                        <h4>Address</h4>
                        <input type="text" id="address">
                    </div>
                </div>
                <button id="update-user"></button>
            </div>
        </div>
    </div>
*/

class Users {
    usersHolder;
    firstNameHolder;
    lastNameHolder;
    birthDateHolder;
    ageHolder;
    emailHolder;
    addressHolder;
    userImgHolder;
    updateUserBtn;
    page;
    maxPage;
    nextBtn;
    prevBtn;
    pageH4;

    constructor() {
        this.usersHolder = document.querySelector("#users-holder");
        this.firstNameHolder = document.querySelector("#first-name");
        this.lastNameHolder = document.querySelector("#last-name");
        this.birthDateHolder = document.querySelector("#birth-date");
        this.ageHolder = document.querySelector("#age");
        this.addressHolder = document.querySelector("#address");
        this.userImgHolder = document.querySelector("#user-image");
        this.updateUserBtn = document.querySelector("#update-user");
        this.prevBtn = document.querySelector("#prev");
        this.nextBtn = document.querySelector("#next");
        this.pageH4 = document.querySelector("#page");

        this.page = 1;
        this.maxPage = 0;
        this.updateUserClick();
        this.prevBtn();
        this.nextBtn();

    }

    /*
    Ahhoz, hogy lapozni tudjunk kell egy prevBtn és egy nextBtn meg egy pageH4, ahol megjelenítjük, hogy hányadik oldalon vagyunk 
    kell egy page, ami egyről indul, az első oldal meg egy maxPage és akkor így lesz kiírva page/maxPage 2/5 mondjuk 
    */

    async getUsers() {
        try {
                    /*
        a skip az lesz, hogy page-1 * 24
        Mert ha az első oldalon vagyunk, akkor egyet se akarunk skip-elni, ha meg 2-dikon vagyunk, akkor meg 24-et 
        Annyit skip-elünk, amennyit akarunk, csak az a lényeg, hogy mindig page-1 legyen!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        */
        const skip = (this.page - 1) * 24;
        //url-be beírjuk a limit-et meg a skip-et skip ugye az változni fog és így az url is!!!
        //limit, hogy egy oldalon hámny jelenjen meg skip meg 24 ha a második oldalon majd 48, 72 .. 
        const response = await fetch("https://dummyjson.com/users?limit=24&skip=" + skip);
        const json = await response.json();
        this.maxPage = json.total; 

        if(response.ok) {
            this.usersHolder.innerHTML = ""; //ezzel kiűrítjük úgy, hogy semmi se legyen benne 

            for(const user of json.users) {
                const userDiv = document.createElement("div");
                userDiv,classList.add("user");

                const nameH3 = document.createElement("h3");
                nameH3.innerText = `${user.firstName} ${user.lastName}`;

                const userImgDiv= document.createElement("div");
                userImgDiv.classList.add("user-img");
                const userImg = document.createElement("img");
                userImg.src = user.image;
                userImgDiv.appendChild(userImg);

                const grid2Div = document.createElement("div");
                grid2Div.classList.add("grid-2");
                const openDiv = document.createElement("div");
                openDiv.innerHTML = `<a href="user.html?id=${user.id}">Megnyítás</a>`
                const deleteDiv = document.createElement("div");
                const deleteBtn = document.createElement("button");
                deleteBtn.innerText = "Törlés";
                deleteDiv.appendChild(deleteBtn);

                grid2Div.appendChild(openDiv);
                grid2Div.appendChild(deleteDiv);

                userDiv.appendChild(grid2Div);
                userDiv.appendChild(userImgDiv);
                userDiv.appendChild(nameH3);

                this.usersHolder.appendChild(userDiv);

                /*
                csinálink egy függvényt a delete-nek és utána megcsináljuk itt az eventListener-t a deleteBtn-re, aminek majd 
                átadjuk azt a függvényt, csak az vár egy id-t is, hogy melyik user-t akarjuk törölni, amit meg itt tudunk neki átadni!!!!!!!!!
                */ 
                deleteBtn.addEventListener("click", async()=> {
                    const isDeleted = await this.deletedUser(user.id);
                    if(isDeleted)
                        userDiv.remove();

                    /*
                    fontos, dolgok!!!! 
                    1. asnyc-nak kell lenni mert itt egy async függvényt hívtunk meg benne 
                    2. azért mentettük le egy változóban, mert kitöröltük a rendszerből, de még a userDiv-amiben volt az ott lesz 
                        ezért kitöröljük annak az id-s user-nek a html-ből is 
                    és még ahhoz jött, hogy a deleteUser-ben return-ülünk egy true-t és úgy tudjuk csak vizsgálni hogy a 
                    idDeleted az true vagy nem!!!!!!!!!!!!!!!!!!!!
                    */
                })
            }
        }
        } catch(err) {
            console.log(err);
        }
    }

    /*
    delete függvény két dolgot csinál 
    - kitörli a rendszerből a user-t 
    - return-öl egy true, ha ez sikerült, hogy tudjuk vizsgálni ezt if(isDeleted)
        és akkor ha true, akkor kitöröljük a html elemet is userDiv.remove(); a remove()-val 
    Nagyon fontos a remove(), így tudunk egy html elemet kitörölni 
    */
    async deleteUser(id) {
        //ez vár egy id-t, amit majd megkap meghívásnál a getUsers-ben!! 
        try {
            const response = await fetch("https://dummyjson.com/users/" + id, {
                method: "DELETE"
            });

            const json = await response.json();

            if(response.ok) {
                alert("Sikeres törlés!");
                return true;
            } else {
                alert(json.message); //hogy lássák is, hogy mi a hiba alert-be, ne csak a console.log, olyan mint a throw new Error()
                return false;
            }
        } catch(err) {
            console.log(err);
            return false;
        }
    }
    /*
    updateUser vár egy id-t, hogy melyik user-t fogjuk updatelni és egy user-t, hogy mivel 
    fontos, hogy ezt két függvény csinálunk még ennek 
        1. megnézni, hogy helyesen töltötte ki az input-ot a felhasználó, amivel update-lni szeretné 
        2. magát, hogyha megnyomja a gombot, akkor csináljon egy user objektumot, amit majd megadunk a PUT metódusnak 
    */

    async updateUser() {
        try{
            //elöször megnézzük, hogy jó-e, ha nem akkor meg a catch-be kiírjuk amit ott megadtunk specifikus hibaüzenetet
            this.checkInputs(user);

            const response = await fetch("https://dummyjson.com/users/"+ id, {
                method: "PUT",
                body: JSON.stringify(user),
                headers: {"content-tyoe":"application/json"}
            }); 

            const json = await response.json();

            if(response.ok) {
                alert("Sikeres felülírás!");
            } else {
                alert("A felülírás sikertelen volt!");
            }
        } catch(err) {
            console.log(err);
            Array.isArray(err);
                alert(err.join("\n"));//ezt azt jelenti, hogy minden egyes hibaüzenet ha több van ugye akkor új sorban legyen!! 
            /*
            itt nagyon fontos, hogy Array.isArray()-vel tudjuk megnézni hogy valami tömb-e 
            Azért fontos, mert lehetnek más hibaüzenetek is, de azok nem tömbökben lesznek 
            és ha ez az err az egy tömb, akkor join-olunk a tömböt stringgé alakítjuk és minden eleme új sorban lesz 
            alert(err.join("\n")) az olyan mint, hogy err.join(", ") csak pluszba még új sorban is lesznek!! 
            */
        }
    }

    checkInputs(user) {
        const errors = [];
        //ide gyüjtjük majd az error üzeneteinket
        if(user.firstName.length === 0) 
            errors.push("A keresztnév nem maradhat üresen!");
        if(user.lastName.length === 0)
            errors.push("A vezetéknév nem maradhat üresen!");
        if(!/^[/d]{4}\-[/d]{4}\-[/d]{4}$/.test(user.birthDate))
            errors.push("A dátum formátuma nem megfelelő");
        if(!/^([\w\.\-\_]{0,255})\@([\w\.\-\_]{0,255})\.([\w]{2,})$/.test(user.email))
            errors.push("Az email cím formátuma nem megfelelő");

        if(errors.length > 0)
            throw errors; // itt throw-oljuk az error-t, de majd az updateUser függvény catch ágában írjuk ki 
        /*
        Nagyon fontos, hogyha throw-olunk egy error-t, akkor legyen egy catch ág, ahol majd ezt ki tudjuk írni 
        jelen esetben itt throw-olunk valamit de ezt a függvényt meghívjuk az updateUser legelején és majd ott 
        írjuk ki ha itt az errors tömb length-je az nem nulla 
        */
        
    }

    async updateUserClick() {
        /*
        ha nincsen button akkor return, mert ez probléma volt, hogy a másik oldalon ott ugye nincs button és ott is akart valamit 
        az a lényeg, hogy ez csak akkor fusson le ha van btn!!!!!!!!!!!!
        */
        if(this.updateBtn === null)
            return;
        /*
        Sokkal jobb az, hogy meghatározzuk, hogy mi nem jó és akkor rögtön egy return a függvény elején, minthogy ha nincs button 
        akkor ez meg az 
        */

        this.updateUserBtn.addEventListener("click", ()=> {
            /*
            az input-okat lementettük és most csináltunk egy objektumot, majd a lementett dolgoknak a value-ját megadjuk egy kulcsnak, 
            hogy objektum legyen 
            fontos
                this-vel hivatkozunk minden lementett dologra, ami a class-ban van!!!!!! 
                trim(), hogy ne legyen whitespace
                ugye a lementésnek van két variációja 
                egyszerübb, amit itt is alkalmazunk, hogy value
                de lehet úgy is, hogy megadunk e-t (e)=> és mint React-ben e.target.value
            */
            const user = {
                firstName: this.firstNameHolder.value.trim(),
                lastName: this.lastNameHolder.value.trim(),
                birthDate: this.birthDateHolder.value.trim(),
                age:parseInt(this.ageHolder.value), /*
                amit itt visszakapunk a value-val az mind string lesz ezért kell a parseInt, ha számot akarunk*/
                email: this.emailHolder.value.trim(),
                address: this.addressHolder.value.trim()
            }

            this.updateUser(user, urlObj.query.id);
            /*
            fontos, hogy itt kell meghívni az updateUser-t mert, itt kapja meg a user-t meg a id-t is átadjuk neki
            */
        })
    }


    //meg van hívva a constructor-ban, úgy mint a prev is 
    next() {
        if(this.nextBtn === null) 
            return;

        this.nextBtn.addEventListener("click", ()=> {
            this.page++;
            //növeljük eggyel a page-t ami nulláról indul 
            this.getUsers();
        }); 
    }

    prev() {
        if(this.prevBtn === null) 
            return;

        this.prevBtn.addEventListener("click", ()=> {
            this.page--;
            this.getUsers();
            /*
            ezeket meg kell hívni mindig mert a skip az változni fog -> const skip = (this.page - 1) * 24;
            és akkor ez is változik -> "https://dummyjson.com/users?limit=24&skip=" + skip
            */
        });
    }
}

export default Users;