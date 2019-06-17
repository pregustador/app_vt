from flask import Flask, jsonify, request, render_template, render_template_string
import matplotlib.pyplot as plt
import matplotlib.tri as mtri
import matplotlib.animation as animation
from mpl_toolkits.mplot3d import Axes3D
import urllib, base64
# from matplotlib import cm
# import io

app = Flask(__name__)

@app.route('/') # if we not putting method the default is GET
def home():
    return render_template('index.html')

@app.route('/output_dem', methods=['GET','POST']) # if we not putting method the default is GET
def graphic():
    print("oi")
    if request.method == 'POST':
        print("oi POST")
        try:
            data = request.get_json()
            # data = json.loads(data)
            x = [float(x) for x in data["lng"]]
            y = [float(x) for x in data["lat"]]
            z = [float(x) for x in data["elev"]]

            triang = mtri.Triangulation(x,y)

             # Get instance of Axis3D
            # fig = plt.figure()

            # ax = fig.gca(projection='3d')

            # ax.plot_trisurf(triang, z, cmap='jet')
            # ax.scatter(x,y,z, marker='.', s=10, c="black", alpha=0.5)
            # ax.view_init(elev=20, azim=-45)
            # ax.set_xlabel('X')
            # ax.set_ylabel('Y')
            # ax.set_zlabel('Z')
            # plt.show()


            fig = plt.figure()
            ax = Axes3D(fig)

            def init():
                # Plot the surface.
                ax.plot_trisurf(triang, z, cmap='jet')
                ax.scatter(x,y,z, marker='.', s=10, c="black", alpha=0.5)
                ax.scatter(x[-1::],y[-1::],z[-1::], marker='o', s=20, c="red", alpha=0.7)
                ax.set_xlabel('X')
                ax.set_ylabel('Y')
                ax.set_zlabel('Z')
                return fig,

            def animate(i):
                # azimuth angle : 0 deg to 360 deg
                # ax.view_init(elev=10, azim=i*4)
                ax.view_init(elev=10, azim=i*4*3)
                return fig,

            # Animate azim=i*4 frames=90 fps=30 interval=50
            ani = animation.FuncAnimation(fig, animate, init_func=init,
                                            frames=30, interval=50, blit=True)
            ani.save('tmp/imgdem.gif', writer='imagemagick', fps=10)

            # ani.save('tmp/imgdem_.mp4', fps=30)
            # ani = animation.FuncAnimation(fig, animate, init_func=init,interval=30)
            # writer = animation.writers['ffmpeg'](fps=30)
            # ani.save('tmp/imgdem.mp4',writer=writer,dpi=dpi)



            # buf = io.BytesIO()
            # fig.savefig(buf, format='png')
            # buf.seek(0)
            # string = base64.b64encode(buf.read())
            # uri = urllib.parse.quote(string)
            # return jsonify(html=uri)

            image = open('tmp/imgdem.gif', 'rb') #open binary file in read mode
            # image = open('tmp/imgdem.mp4', 'rb') #open binary file in read mode
            image_read = image.read()
            image_64_encode = base64.encodestring(image_read)
            uri = urllib.parse.quote(image_64_encode)

            return jsonify(html=uri)

        except:
            print("oi except")
            return render_template_string("Not work")
    else:
        print("oi else")
        return render_template_string("Not work")


@app.route('/sjc_sjc_district_pol.json', methods=['GET','POST'])
def static_geojson_sjc_sjc_pol():
    return app.send_static_file('sjc_sjc_district_pol.json')

@app.route('/sjc_sjc_district_pt.json', methods=['GET','POST'])
def static_geojson_sjc_sjc_pt():
    return app.send_static_file('sjc_sjc_district_pt.json')

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


# app.run(port=5000)
# app.run(host='0.0.0.0')

# It's just to work https
if __name__ == "__main__":
    app.run(port=5000, debug=True)
    # app.run(ssl_context='adhoc',host='0.0.0.0')
    # app.run(ssl_context='adhoc')
