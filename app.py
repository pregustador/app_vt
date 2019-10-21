from flask import Flask, jsonify, request, render_template, render_template_string
import matplotlib.pyplot as plt
import matplotlib.tri as mtri
import matplotlib.animation as animation
from mpl_toolkits.mplot3d import Axes3D
import urllib, base64

app = Flask(__name__)

@app.route('/') # if we not putting method the default is GET
def home():
    return render_template('index.html')

@app.route('/output_dem', methods=['GET','POST']) # if we not putting method the default is GET
def graphic():
    # print("ok")
    if request.method == 'POST':
        #print("Request POST Ok")
        try:
            data = request.get_json()
            # data = json.loads(data)
            x = [float(x) for x in data["lng"]]
            y = [float(x) for x in data["lat"]]
            z = [float(x) for x in data["elev"]]

            triang = mtri.Triangulation(x,y)

            fig = plt.figure()
            ax = Axes3D(fig)

            def init():
                # Plot the surface.
                ax.plot_trisurf(triang, z, cmap='jet', alpha=0.8)
                ax.scatter(x,y,z, marker='.', s=15, c="black", alpha=0.2)
                ax.scatter(x[-1::],y[-1::],z[-1::], marker='*', s=40, c="black", alpha=0.9)
                ax.set_xlabel('X')
                ax.set_ylabel('Y')
                ax.set_zlabel('Z')
                return fig,

            def animate(i):
                # azimuth angle : 0 deg to 360 deg
                ax.view_init(elev=10, azim=i*4*5)
                return fig,

            # Animate azim=i*4 frames=90 fps=30 interval=50
            ani = animation.FuncAnimation(fig, animate, init_func=init,
                                            frames=18, interval=50, blit=True)
            ani.save('tmp/imgdem.gif', writer='imagemagick', fps=6)

            image = open('tmp/imgdem.gif', 'rb') #open binary file in read mode
            # image = open('tmp/imgdem.mp4', 'rb') #open binary file in read mode
            image_read = image.read()
            image_64_encode = base64.encodestring(image_read)
            uri = urllib.parse.quote(image_64_encode)

            return jsonify(html=uri)

        except:
            print("Not Work 1")
            return render_template_string("Not work")
    else:
        print("Not Work 2")
        return render_template_string("Not work")


@app.route('/sjc_sjc_district_pol.json', methods=['GET','POST'])
def static_geojson_sjc_sjc_pol():
    return app.send_static_file('sjc_sjc_district_pol.json')

@app.route('/sjc_sjc_district_pt.json', methods=['GET','POST'])
def static_geojson_sjc_sjc_pt():
    return app.send_static_file('sjc_sjc_district_pt.json')

@app.route('/sjc_em_district_pol.json', methods=['GET','POST'])
def static_geojson_sjc_em_pol():
    return app.send_static_file('sjc_em_district_pol.json')

@app.route('/sjc_em_district_pt.json', methods=['GET','POST'])
def static_geojson_sjc_em_pt():
    return app.send_static_file('sjc_em_district_pt.json')

@app.route('/jac_district_pol.json', methods=['GET','POST'])
def static_geojson_jac_pol():
    return app.send_static_file('jac_district_pol.json')

@app.route('/jac_district_pt.json', methods=['GET','POST'])
def static_geojson_jac_pt():
    return app.send_static_file('jac_district_pt.json')

@app.route('/stabranca_district_pol.json', methods=['GET','POST'])
def static_geojson_stabranca_pol():
    return app.send_static_file('stabranca_district_pol.json')

@app.route('/stabranca_district_pt.json', methods=['GET','POST'])
def static_geojson_stabranca_pt():
    return app.send_static_file('stabranca_district_pt.json')

################## service-worker route for pwa ###################
@app.route('/sw.js', methods=['GET'])
def sw():
    return app.send_static_file('sw.js')

# It's just to work https
if __name__ == "__main__":
    app.run(port=5000, debug=True)
    # app.run(ssl_context='adhoc',host='0.0.0.0')
    # app.run(ssl_context='adhoc')
