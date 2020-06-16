var swatch_list = {};

(async function () {

    async function getUserInfo() {
        var response = {}
        var payload = {
            clientPrincipal: {
            }
        };
        try {
            response = await fetch("/.auth/me");
            payload = await response.json();
            if (!payload || !payload.clientPrincipal.userRoles)
                payload = {
                    clientPrincipal:
                    {
                        "identityProvider": "",
                        "userId": "",
                        "userDetails": "",
                        "userRoles": []
                    }
                };
        } catch (e) {
            console.log("ERROR")
            console.log(e)
            payload = {
                clientPrincipal:
                {
                    "identityProvider": "",
                    "userId": "",
                    "userDetails": "",
                    "userRoles": []
                }
            };
        }
        console.log(payload)
        return payload.clientPrincipal;
    }
    userInfo = await getUserInfo();
    console.log(userInfo)
    swatch_list = []
    try {
        if (userInfo && userInfo.userRoles.length > 0) {
            let response = await fetch("/api/recipie");
            let message = await response.json();
            swatch_list = message.recipies;
        }
    } catch (e) {
        swatch_list = []
    }

    Vue.component('recipie-swatch', {
        props: ['swatch', 'in_gramm', 'delete_swatch', 'index',],
        template: '#recipie-swatch',
    })

    for (i = 0; i < swatch_list.length; i++) {

        c_val = swatch_list[i].cyan_pct / 100;
        m_val = swatch_list[i].magenta_pct / 100;
        y_val = swatch_list[i].yellow_pct / 100;
        k_val = swatch_list[i].black_pct / 100;

        r_val = 255 * (1 - c_val) * (1 - k_val)
        g_val = 255 * (1 - m_val) * (1 - k_val)
        b_val = 255 * (1 - y_val) * (1 - k_val)

        swatch_list[i].rgb_value = '#' + ('0' + Math.trunc(r_val).toString(16)).substr(-2) +
            ('0' + Math.trunc(g_val).toString(16)).substr(-2) +
            ('0' + Math.trunc(b_val).toString(16)).substr(-2);

    }

    var bdy = new Vue({
        el: '#app',
        data: {
            user_info: userInfo,
            recipies: swatch_list,
            homepage_title: 'My Paint Mixer',
            newSwatch: {
                name: "new Swatch",
                cyan_pct: 0,
                magenta_pct: 0,
                yellow_pct: 0,
                black_pct: 50
            },
            searchTerm: ""
        },
        methods: {
            in_gramm: function (in_pct, in_total) {
                return ((in_total / 4) * (in_pct / 100)).toFixed(1);
            },
            searchSwatch: function () {
                alert('search: ' + this.searchTerm)
            },
            addSwatch: async function () {

                // alert(JSON.stringify(this.newSwatch, ' ', 1))
                let response = await fetch("/api/recipie",
                    {
                        method: "POST",
                        body: JSON.stringify(this.newSwatch)
                    }
                );

                let message = await response.json();

                localSwatch = this.newSwatch;
                localSwatch.rgb_value = this.rgb_value;

                this.recipies.push(localSwatch);

            },
            delete_swatch: async function (index) {
                swatchId = this.recipies[index].name;
                let response = await fetch("/api/recipie/" + swatchId,
                    {
                        method: "DELETE"
                    }
                );

                let message = await response.json();
                this.recipies.splice(index, 1);
            }
        },
        computed: {
            rgb_value: function () {
                c_val = this.newSwatch.cyan_pct / 100;
                m_val = this.newSwatch.magenta_pct / 100;
                y_val = this.newSwatch.yellow_pct / 100;
                k_val = this.newSwatch.black_pct / 100;

                r_val = 255 * (1 - c_val) * (1 - k_val)
                g_val = 255 * (1 - m_val) * (1 - k_val)
                b_val = 255 * (1 - y_val) * (1 - k_val)

                rgb_col = '#' + ('0' + Math.trunc(r_val).toString(16)).substr(-2) +
                    ('0' + Math.trunc(g_val).toString(16)).substr(-2) +
                    ('0' + Math.trunc(b_val).toString(16)).substr(-2);

                return rgb_col;
            }
        }
    })

})();