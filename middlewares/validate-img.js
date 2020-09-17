const validateImg = (req, res, next ) => {

    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'There is no file'
        });
    }

    
    const file = req.files.img;

    if(file.size > 3000000 ){
        return res.status(400).json({
            ok: false,
            message: 'picture too big!!'
        });
    }

    const cutName = file.name.split('.'); 
    const fileExtension = cutName[cutName.length - 1];
    
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({
            ok: false,
            message: 'It is not an allowed extension'
        });
    }

    next();
}

module.exports = {
    validateImg
}
