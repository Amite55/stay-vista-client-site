import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "../../../hooks/useAuth";
import { imageUpload } from "../../../api/utils";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState();
    const [imageText, setImageText] = useState('upload image');
    const [dates, setDates] = useState({
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        })
        // ===== handle date range =======
        const handleDates = (item) => {
            console.log(item);
            setDates(item.selection)
        }
        
        const {mutateAsync} = useMutation({
            mutationFn: async (roomData) => {
                const {data} = await axiosSecure.post('/room', roomData)
                return data;
            }, 
            onSuccess: () => {
                console.log('Data saved successful');
                toast.success('Room Added successfully!')
                navigate('/dashboard/my-listings')
                setLoading(false)
            }
        })

        //  ====== form handler ========
        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true)
            const form = e.target;
            const location = form.location.value;
            const category = form.category.value;
            const title = form.title.value;
            const price = form.price.value;
            const to = dates.endDate;
            const from = dates.startDate;
            const guests = form.total_guest.value;
            const bathrooms = form.bathrooms.value;
            const description = form.description.value;
            const bedrooms = form.bedrooms.value;
            const image = form.image.files[0];
            const host = {
                name: user?.displayName,
                image: user?.photoURL,
                email: user?.email
            };
           
            try{
                const image_url = await imageUpload(image);
                const roomData = {
                    location, category, title, price, to, from, guests, bathrooms, description, bedrooms, host, image: image_url
                }
                await mutateAsync(roomData)
            }catch(error){
                toast.error('please try again')
                console.log(error);
                setLoading(false)
            }
        }

        // ============ handle image change ========
        const handleImage = (image) => {
            setImagePreview(URL.createObjectURL(image))
            setImageText(image.name)
        }

    return (
        <>

            <Helmet>
                <title>Add Room | Dashboard</title>
            </Helmet>

            <h1>Add Room Page</h1>

            {/* ========= add room form ========== */}
            <AddRoomForm 
            dates={dates} 
            handleDates={handleDates} 
            handleSubmit={handleSubmit}
            imagePreview={imagePreview}
            handleImage={handleImage}
            imageText={imageText}
            loading={loading}
            />
        </>
    );
};

export default AddRoom;