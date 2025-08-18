from pygltflib import GLTF2, Scene, Node, Mesh, Primitive, Accessor, Buffer, BufferView, Attributes
import numpy as np

def create_cube_gltf(output_path="frontend/public/assets/3d/cube.glb"):
    # Vertices of a cube
    vertices = np.array([
        [-0.5, -0.5, -0.5], [ 0.5, -0.5, -0.5], [ 0.5,  0.5, -0.5], [-0.5,  0.5, -0.5], # Front face
        [-0.5, -0.5,  0.5], [ 0.5, -0.5,  0.5], [ 0.5,  0.5,  0.5], [-0.5,  0.5,  0.5]  # Back face
    ], dtype=np.float32)

    # Indices for the cube (12 triangles, 36 indices)
    indices = np.array([
        0,1,2, 2,3,0, # Front
        4,5,6, 6,7,4, # Back
        0,4,7, 7,3,0, # Left
        1,5,6, 6,2,1, # Right
        0,1,5, 5,4,0, # Bottom
        3,2,6, 6,7,3  # Top
    ], dtype=np.uint16)

    # Create binary buffer for vertices and indices
    vertex_buffer = vertices.tobytes()
    index_buffer = indices.tobytes()

    # Create GLTF structure
    gltf = GLTF2()

    # Buffer
    buffer = Buffer(byteLength=len(vertex_buffer) + len(index_buffer))
    gltf.buffers.append(buffer)

    # BufferViews
    vertex_buffer_view = BufferView(
        buffer=0,
        byteOffset=0,
        byteLength=len(vertex_buffer),
        target=34962 # ARRAY_BUFFER
    )
    index_buffer_view = BufferView(
        buffer=0,
        byteOffset=len(vertex_buffer),
        byteLength=len(index_buffer),
        target=34963 # ELEMENT_ARRAY_BUFFER
    )
    gltf.bufferViews.extend([vertex_buffer_view, index_buffer_view])

    # Accessors
    position_accessor = Accessor(
        bufferView=0,
        byteOffset=0,
        componentType=5126, # FLOAT
        count=len(vertices),
        type="VEC3",
        max=vertices.max(axis=0).tolist(),
        min=vertices.min(axis=0).tolist()
    )
    index_accessor = Accessor(
        bufferView=1,
        byteOffset=0,
        componentType=5123, # UNSIGNED_SHORT
        count=len(indices),
        type="SCALAR",
        max=[int(indices.max())],
        min=[int(indices.min())]
    )
    gltf.accessors.extend([position_accessor, index_accessor])

    # Primitive
    primitive = Primitive(
        attributes=Attributes(POSITION=0),
        indices=1
    )

    # Mesh
    mesh = Mesh(primitives=[primitive])
    gltf.meshes.append(mesh)

    # Node
    node = Node(mesh=0)
    gltf.nodes.append(node)

    # Scene
    scene = Scene(nodes=[0])
    gltf.scenes.append(scene)
    gltf.scene = 0

    # Save GLB
    gltf.set_binary_blob(vertex_buffer + index_buffer)
    gltf.save(output_path)
    print(f"Cube model saved to {output_path}")

if __name__ == "__main__":
    create_cube_gltf()


