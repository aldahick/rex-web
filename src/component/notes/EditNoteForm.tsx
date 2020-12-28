import { useMutation } from "@apollo/client";
import {
  Button, Checkbox, Grid, TextField,
} from "@material-ui/core";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";

import { IMutationUpdateNoteBodyArgs, INote } from "../../graphql/types";
import { useStores } from "../../hook/useStores";
import { callMutationSafe } from "../../util/graphql";

const MUTATION_UPDATE_NOTE_BODY = gql`
mutation Web_UpdateNoteBody($id: String!, $body: String!) {
  updateNoteBody(id: $id, body: $body)
}
`;

export const EditNoteForm: React.FC<{
  note: INote;
}> = ({ note }) => {
  const { statusStore } = useStores();
  const [updateNoteBody] = useMutation<unknown, IMutationUpdateNoteBodyArgs>(MUTATION_UPDATE_NOTE_BODY);
  const [body, setBody] = useState(note.body);
  const [key, setKey] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(body !== note.body);
  const [isKeyValid, setIsKeyValid] = useState(false);

  const encodedKey = async (iv: Uint8Array, usage: KeyUsage) => crypto.subtle.importKey(
    "raw",
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key)),
    {
      name: "AES-GCM",
      // iv,
      length: 256,
    },
    false,
    [usage],
  );

  const isCryptoSupported = () => ("crypto" in window) && ("subtle" in crypto) && ("encrypt" in crypto.subtle);

  const encryptBody = async (): Promise<string | undefined> => {
    if (!isEncrypted) {
      return body;
    }
    if (!isCryptoSupported()) {
      statusStore.setErrorMessage("Insecure browser context. Use HTTPS to edit secure notes.");
      return undefined;
    }
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encrypted = new Uint8Array(await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      await encodedKey(iv, "encrypt"),
      new TextEncoder().encode(body),
    ));
    return JSON.stringify({
      iv: Array.from(iv),
      encrypted: Array.from(encrypted),
    });
  };

  const decryptBody = async (): Promise<string | undefined> => {
    let data: { iv: number[]; encrypted: number[] };
    try {
      data = JSON.parse(note.body) as { iv: number[]; encrypted: number[] };
    } catch (err) { // if not valid JSON,
      return undefined; // it's not encrypted at all
    }
    if (!isCryptoSupported()) {
      statusStore.setErrorMessage("Insecure browser context. Use HTTPS to edit secure notes.");
      return "";
    }
    if (!key) {
      return "";
    }
    const iv = new Uint8Array(data.iv);
    const encrypted = new Uint8Array(data.encrypted);
    try {
      return await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv,
        },
        await encodedKey(iv, "decrypt"),
        encrypted,
      ).then(d => new TextDecoder().decode(d));
    } catch (err) {
      if (err instanceof DOMException) {
        statusStore.setErrorMessage(err.message);
      }
      return "";
    }
  };

  const attemptDecryptBody = () => {
    decryptBody().then(newBody => {
      if (newBody !== undefined) {
        setBody(() => {
          setIsEncrypted(true);
          if (newBody === "") {
            return "*** Encrypted ***";
          }
          setIsKeyValid(true);
          return newBody;
        });
      }
    }).catch(err => statusStore.setErrorMessage(err instanceof Error ? err.message : err));
  };

  const submit = async () => {
    try {
      const encryptedBody = await encryptBody();
      if (encryptedBody === undefined) {
        return;
      }
      await callMutationSafe(updateNoteBody, {
        id: note._id,
        body: encryptedBody,
      });
      statusStore.setSuccessMessage("Updated note body");
    } catch (err) {
      statusStore.setErrorMessage(err instanceof Error ? err.message : err);
    }
  };

  if (!isKeyValid) {
    attemptDecryptBody();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(attemptDecryptBody, [key]);

  return (
    <Grid container direction="column">
      <Grid item>
        <TextField rowsMax={0} multiline label="Body" value={body} onChange={evt => setBody(evt.target.value)} />
      </Grid>
      <Grid item>
        <TextField type="password" label="Key" value={key} onChange={evt => setKey(evt.target.value)} />
      </Grid>
      <Grid item>
        <Checkbox value={isEncrypted} checked={isEncrypted} onChange={evt => setIsEncrypted(evt.target.checked)} />
        <Button onClick={submit}>
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};
