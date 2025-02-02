const videoRouter = Router();

videoRouter.route("/upload").post(verifyJWT, 
	upload.fields([
		{
			name: "thumbnail",
			maxCount: 1
		},
		{
			name: "video",
			maxCount: 1
		}
	])
)