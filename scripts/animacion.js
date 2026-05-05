window.addEventListener("load", iniciarAnimaciones);

function iniciarAnimaciones() {
    var chin1 = document.querySelector("article:nth-of-type(1) .chincheta");
    chin1.classList.add("chincheta1");

    chin1.addEventListener("animationend", function () {
        var art1 = document.querySelector("article:nth-of-type(1)");
        art1.classList.add("article1");

        art1.addEventListener("animationend", function () {
            var chin2 = document.querySelector("article:nth-of-type(2) .chincheta");
            chin2.classList.add("chincheta2");

            chin2.addEventListener("animationend", function () {
                var chin3 = document.querySelector("article:nth-of-type(3) .chincheta");
                chin3.classList.add("chincheta3");

                chin3.addEventListener("animationend", function () {
                    var art3 = document.querySelector("article:nth-of-type(3)");
                    art3.classList.add("article3");
                });
            });
        });
    });
}