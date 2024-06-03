import { useState, useContext } from "react"
import { GlobalContext } from "context"

import View from "ui/View"
import Button from "ui/Button"
import TextField from "ui/TextField"
import FileInput from "ui/FileInput"

import http from "utils/http"
import { convertBlob2DataUri } from "utils/file"

const maxFileSize = 5 * 1024 * 1024; // 5MB
const acceptedFileTypes = ["image/jpeg", "image/png"];

export default function AdminView({ show }) {
  const { showPopup } = useContext(GlobalContext);
  const [adminToken, setAdminToken] = useState("");
  const [nameField, setNameField] = useState("");
  const [passField, setPassField] = useState("");
  const [signImgField, setSignImgField] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * Create a new user
   */
  const requestCreateUser = () => {
    if (!validateAdminToken(adminToken)) {
      showPopup("Invalid admin token", "danger");
      return;
    }

    if (!nameField || !passField || !signImgField) {
      showPopup("Please fill in all fields", "danger");
      return;
    }

    http
      .post({
        url: "/admin/user",
        headers: { "Authorization": "Bearer " + adminToken },
        body: {
          name: nameField,
          pass: passField,
          sign_img: signImgField,
        },
      })
      .then(({ data, status }) => {
        showPopup(data.message, status ? "success" : "danger");
      })
      .catch((error) => {
        showPopup("Error creating user", "danger");
      });
  };

  const validateAdminToken = (token) => {
    // Add your validation logic here
    return token.length > 0;
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.size > maxFileSize) {
      showPopup("File size should be less than 5MB", "danger");
      return;
    }

    if (!acceptedFileTypes.includes(file.type)) {
      showPopup("Only JPEG and PNG files are allowed", "danger");
      return;
    }

    convertBlob2DataUri(file)
      .then((uri) => setSignImgField(uri))
      .catch((error) => {
        showPopup("Error converting file", "danger");
      });
  };

  return (
    <View show={show} className="p-3">
      <TextField
        placeholder="Admin Key..."
        value={adminToken}
        onInput={(e) => setAdminToken(e.target.value)}
      />
      <hr />
      <hr />
      <h2>Create user</h2>
      <TextField
        placeholder="user-name..."
        value={nameField}
        onInput={(e) => setNameField(e.target.value)}
      />
      <TextField
        placeholder="user-pass..."
        value={passField}
        onInput={(e) => setPassField(e.target.value)}
      />
      <FileInput
        className="my-2"
        type="file"
        accept={acceptedFileTypes.join(", ")}
        onChange={handleFileInputChange}
      />
      <Button
        disabled={!nameField || !passField || !signImgField}
        onClick={requestCreateUser}
      >
        Create user
      </Button>
      <hr />
      <hr />
      <hr />
      <Button
        onClick={() => {
          setIsDownloading(true);
          http
            .getDownload({
              url: "/admin/backup",
              fileName: "acerco.backup.zip",
              headers: {
                "Authorization": "Bearer " + adminToken
              }
            })
            .then(() => {
              setIsDownloading(false);
              showPopup("Listo!");
            })
            .catch(() => {
              setIsDownloading(false);
              showPopup("Error downloading backup", "danger");
            });
        }}
        disabled={isDownloading}
      >
        {isDownloading ? "Downloading..." : "Download db backup"}
      </Button>
    </View>
  );
}
