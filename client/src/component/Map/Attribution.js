import editStyle from "./Style";
const p = [
    "A330-203",
    "B737-3B7",
    "A320-232",
    "B737-476",
    "A320-242",
    "B717-200",
    "A737-3B7"
];
const Attribution = {
    makeTable(){
        let base = "";
        for (var z = 0; z < p.length; z++) {
            if (z % 2 === 0) {
                var str =
                    "<tr>" +
                    '  <th scope="row">' +
                    p[z] +
                    "</th>" +
                    "  <td>" +
                    '     <svg width="50" height="50" viewBox="-100 -50 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
                    '        <path d="' +
                    editStyle.findPlane(p[z]) +
                    '"/>' +
                    "     </svg>" +
                    "  </td>" +
                    '  <th scope="row">' +
                    p[z + 1] +
                    "</th>" +
                    "  <td>" +
                    '     <svg width="50" height="50" viewBox="-100 -50 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
                    '        <path d="' +
                    editStyle.findPlane(p[z + 1]) +
                    '"/>' +
                    "     </svg>" +
                    "  </td>" +
                    "</tr>";
                base = base + str;
            }
        }

        var attribution =
            '<table class="table table-hover">' +
            "  <thead>" +
            "    <tr>" +
            '      <th scope="col">Class</th>' +
            '      <th scope="col">LineColor</th>' +
            '      <th scope="col">Engine</th>' +
            '      <th scope="col">PlaneColor</th>' +
            "    </tr>" +
            "  </thead>" +
            "  <tbody>" +
            "    <tr>" +
            '      <th scope="row">A</th>' +
            "      <td>" +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#ea424d" />\n' +
            "        </svg>" +
            "      </td>" +
            '      <th scope="row">CF6-80E142</th>' +
            "      <td>" +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#111eae" />\n' +
            "        </svg>" +
            "      </td>" +
            "    </tr>" +
            "    <tr>" +
            '      <th scope="row">B</th>' +
            "      <td>" +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#e6ea11" />\n' +
            "        </svg>" +
            "      </td>" +
            '      <th scope="row">CFM56-3B1</th>' +
            "      <td>" +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#56ae2e" />\n' +
            "        </svg>" +
            "      </td>" +
            "    </tr>" +
            "    <tr>" +
            '      <th scope="row">C</th>' +
            "      <td>" +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#363bea" />\n' +
            "        </svg>" +
            "      </td>" +
            '      <th scope="row">CFM-56-3</th>' +
            "      <td>" +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#19ae9a" />\n' +
            "        </svg>" +
            "      </td>" +
            "    </tr>" +
            "    <tr>" +
            '      <th scope="row">D</th>' +
            "      <td>" +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#be42ea" />\n' +
            "        </svg>" +
            "      </td>" +
            '      <th scope="row">V2527-5A</th>' +
            "      <td>" +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#8311ae" />\n' +
            "        </svg>" +
            "      </td>" +
            "    </tr>" +
            "    <tr>" +
            '      <th scope="row">E</th>' +
            "      <td>" +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#15ea5c" />\n' +
            "        </svg>" +
            "      </td>" +
            '      <th scope="row">772B-60</th>' +
            "      <td>" +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#e6ea11" />\n' +
            "        </svg>" +
            "      </td>" +
            "    </tr>" +
            "    <tr>" +
            '      <th scope="row"></th>' +
            "      <td></td>" +
            '      <th scope="row">Unknown</th>' +
            "      <td>" +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#ae0b08" />\n' +
            "        </svg>" +
            "      </td>" +
            "    </tr>" +
            "  </tbody>" +
            "  <thead>" +
            "    <tr>" +
            '      <th scope="col">AircraftModel</th>' +
            '      <th scope="col">PlaneStyle</th>' +
            '      <th scope="col">AircraftModel</th>' +
            '      <th scope="col">PlaneStyle</th>' +
            "    </tr>" +
            "  </thead>" +
            "  <tbody>" +
            base +
            "  </tbody>" +
            "</table>"
        return attribution;
    }
}
export default Attribution;
