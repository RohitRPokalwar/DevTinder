function UserCard({ user, sendRequest }) {
  return (
    <div className="card bg-base-200 w-96 shadow-xl">
      <figure>
        <img
          src={user.photoUrl}
          alt="Profile"
          className="h-96 w-full object-cover"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title text-2xl">
          {user.firstName} {user.lastName}
          {user.isPremium && (
            <div className="badge badge-warning">Premium</div>
          )}
        </h2>

        <p>{user.about}</p>

        <div className="mt-2">
          <h3 className="font-bold">Skills</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.skills && user.skills.map((skill, index) => (
              <div key={index} className="badge badge-primary">
                {skill}
              </div>
            ))}
          </div>
        </div>

        {sendRequest && (
          <div className="card-actions justify-between mt-6">
            <button className="btn btn-error" onClick={() => sendRequest("ignore", user._id)}>Ignore</button>
            <button className="btn btn-success" onClick={() => sendRequest("interested", user._id)}>Interested</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCard;