import User from "../models/User";

export const getUser = async (req,res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id);
        return res.status(200).json({
            success : true,
            payload : user,
            error : null
        })
    } catch (err) {
        return res.status(500).json({error : err.message})
    }
}

export const getUserFriends =  async (req,res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friends.map(id => User.findById(id))
        )

        const formattedFriends = friends.map(
            ({_id,firstName,lastName,occupation,picturePath,location}) => {
                return {_id,firstName,lastName,occupation,picturePath,location}
            }
        ) 
        return res.status(200).json({
            success: true,
            payload: formattedFriends,
            error: null
        })
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}