import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateMovieMutation, useUploadImageMutation } from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import { toast } from "react-toastify";

const CreateMovie = () => {
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: 0,
    detail: "",
    cast: [],
    rating: 0,
    image: null,
    genre: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const [
    createMovie,
    { isLoading: isCreatingMovie, error: createMovieErrorDetail },
  ] = useCreateMovieMutation();

  const [
    uploadImage,
    { isLoading: isUploadingImage, error: uploadImageErrorDetails },
  ] = useUploadImageMutation();

  const { data: genres, isLoading: isLoadingGenres } = useFetchGenresQuery();

  useEffect(() => {

    if (genres) {
      setMovieData((prevData) => ({
        ...prevData,
        genre: genres[0]?._id || "",
      }));
      console.log(genres[0]?._id);
    }
  }, [genres]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "genre") {
      const selectedGenre = genres.find((genre) => genre.name === value);

      setMovieData((prevData) => ({
        ...prevData,
        genre: selectedGenre ? selectedGenre._id : "",
      }));

    } else {
      setMovieData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleCreateMovie = async () => {
    try {
      if (
        !movieData.name ||
        !movieData.year ||
        !movieData.detail ||
        !movieData.cast ||
        !selectedImage
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      let uploadedImagePath = null;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadImageResponse = await uploadImage(formData);

        if (uploadImageResponse.data) {
          uploadedImagePath = uploadImageResponse.data.image;

        } else {
          console.error("Failed to upload image: ", uploadImageErrorDetails);
          toast.error("Failed to upload image");
          return;
        }

        await createMovie({
          ...movieData,
          image: uploadedImagePath,
        });

        navigate("/admin/movies-list");

        setMovieData({
          name: "",
          year: 0,
          detail: "",
          cast: [],
          ratings: 0,
          image: null,
          genre: "",
        });

        toast.success("Movie Added To Database");
      }
    } catch (error) {
      console.error("Failed to create movie: ", createMovieErrorDetail);
      toast.error(`Failed to create movie: ${createMovieErrorDetail?.message}`);
    }
  };

  return (
    
    <div className="relative flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}>
    <div className="absolute inset-0 bg-black opacity-75"></div>
    <div className="relative z-10 bg-opacity-90 p-8 rounded shadow-md">
      <form >
        <p className="text-white w-[50rem] text-2xl mb-4 font-semibold ">Create Movie</p>

        <div className="mb-4">
          <label className="block">
            Name:
            <input type="text"  name="name" value={movieData.name}  onChange={handleChange}  className="border px-2 py-1 w-full" placeholder="Enter movie name"/>
          </label>
        </div>
        <div className="mb-4">
          <label className="block">
            Year:
            <input type="number"  name="year" value={movieData.year} onChange={handleChange} className="border px-2 py-1 w-full"/>
          </label>
        </div>

        <div className="mb-4">
          <label className="block">
            Details:
            <textarea name="detail"  value={movieData.detail} onChange={handleChange} className="border px-2 py-1 w-full" placeholder="Enter movie details">   
            </textarea>
          </label>
        </div>

        <div className="mb-4">
          <label className="block">
            Cast (comma-separated):
            <input  type="text" name="cast"  value={movieData.cast.join(", ")}
              onChange={(e) =>
                setMovieData({ ...movieData, cast: e.target.value.split(", ") })
              }
              className="border px-2 py-1 w-full" placeholder="Enter cast and seperate with commas"/>
          </label>
        </div>

        <div className="mb-4">
          <label className="block">
            Genre:
            <select  name="genre"  value={movieData.genre} onChange={handleChange} className="border px-2 py-1 w-full mb-2" placeholder="Select genre">
              {isLoadingGenres ? (
                <option>Loading genres...</option>
              ) : (
                genres.map((genre) => (
                  <option key={genre._id} value={genre.id}>
                    {genre.name}
                  </option>
                ))
              )}
            </select>
          </label>
        </div>

        <div className="mb-4">
          <label
            style={
              !selectedImage
                ? {
                    border: "1px solid #888", borderRadius: "5px",  padding: "8px", 
                }
                : {
                    border: "0", borderRadius: "0", padding: "0",
                  }
            }
          > 
            {!selectedImage && "Upload Image"}

            <input type="file" accept="image/*"  onChange={handleImageChange}
            style={{ display: !selectedImage ? "none" : "block" }} />
          </label>
        </div>

        <button
          type="button"
          onClick={handleCreateMovie}
          className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 mt-2"
          disabled={isCreatingMovie || isUploadingImage}
        >
          {isCreatingMovie || isUploadingImage ? "Creating..." : "Create Movie"}

        </button>

      </form>

    </div>
    </div>
            
  );
};
export default CreateMovie;