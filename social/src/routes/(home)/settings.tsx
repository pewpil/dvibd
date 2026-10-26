import { A, createAsync, useNavigate, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, Show, type JSX } from "solid-js";
import FeedHeader from "../../components/(home)/FeedHeader";
import { useAuth } from "../../contexts/AuthContext";
import { getSettingsPage, updateProfile } from "../../server/settings";
import {
  MAX_BIO_LENGTH,
  MAX_DISPLAY_NAME_LENGTH,
  MAX_IMAGE_URL_LENGTH,
  MAX_WEBSITE_LENGTH,
  type SettingsProfile,
  type UpdateProfileResult,
} from "../../types/social";
import style from "../../styles/pages/(home)/settings.module.css";

const AVATAR_FALLBACK: string = "/profile-picture.svg";

const COVER_FALLBACK: string = "/profile-cover.svg";

type FieldEvent = InputEvent & {
  currentTarget: HTMLInputElement;
  target: Element;
};

type BioEvent = InputEvent & {
  currentTarget: HTMLTextAreaElement;
  target: Element;
};

interface SettingsFormProps {
  profile: SettingsProfile;
}

export default function Settings(): JSX.Element {
  const settings = createAsync(() => getSettingsPage());

  return [
    <FeedHeader>
      <h1 id={style.headerTitle}>Settings</h1>
      <p id={style.headerSubtitle}>Manage how you appear on social.</p>
    </FeedHeader>,
    <Show when={settings()}>
      {(profile) => <SettingsForm profile={profile()} />}
    </Show>,
    <Show when={settings() === null}>
      <section id={style.signedOut}>
        <h2 id={style.signedOutTitle}>Sign in to edit your profile</h2>
        <p id={style.signedOutText}>
          Your settings are only available to a signed-in account.
        </p>
        <A id={style.signedOutLink} href="/login">
          Go to login
        </A>
      </section>
    </Show>,
  ];
}

function SettingsForm(props: SettingsFormProps): JSX.Element {
  const { logout, refresh } = useAuth();
  const navigate = useNavigate();
  const submission = useSubmission(updateProfile);
  const [displayName, setDisplayName] = createSignal<string>(props.profile.name);
  const [bio, setBio] = createSignal<string>(props.profile.bio);
  const [website, setWebsite] = createSignal<string>(props.profile.website);
  const [avatarUrl, setAvatarUrl] = createSignal<string>(
    props.profile.avatarUrl,
  );
  const [coverUrl, setCoverUrl] = createSignal<string>(props.profile.coverUrl);
  const [signOutError, setSignOutError] = createSignal<string | undefined>(
    undefined,
  );

  createEffect(() => {
    setDisplayName(props.profile.name);
    setBio(props.profile.bio);
    setWebsite(props.profile.website);
    setAvatarUrl(props.profile.avatarUrl);
    setCoverUrl(props.profile.coverUrl);
  });

  createEffect(() => {
    const result: UpdateProfileResult | undefined = submission.result;
    if (result?.ok === true) {
      void refresh();
    }
  });

  const pending = (): boolean => submission.pending === true;

  const error = (): string | undefined => {
    if (submission.error !== undefined) {
      return "Could not save your profile. Try again.";
    }
    const result: UpdateProfileResult | undefined = submission.result;
    if (result !== undefined && !result.ok) {
      return result.error;
    }
    return undefined;
  };

  const succeeded = (): boolean => {
    const result: UpdateProfileResult | undefined = submission.result;
    return result?.ok === true;
  };

  const clearSubmission = (): void => {
    if (submission.result !== undefined || submission.error !== undefined) {
      submission.clear();
    }
  };

  const avatarPreview = (): string => {
    const value: string = avatarUrl().trim();
    return value === "" ? AVATAR_FALLBACK : value;
  };

  const coverPreview = (): string => {
    const value: string = coverUrl().trim();
    return value === "" ? COVER_FALLBACK : value;
  };

  const handleDisplayName = (event: FieldEvent): void => {
    setDisplayName(event.currentTarget.value);
    clearSubmission();
  };

  const handleBio = (event: BioEvent): void => {
    setBio(event.currentTarget.value);
    clearSubmission();
  };

  const handleWebsite = (event: FieldEvent): void => {
    setWebsite(event.currentTarget.value);
    clearSubmission();
  };

  const handleAvatarUrl = (event: FieldEvent): void => {
    setAvatarUrl(event.currentTarget.value);
    clearSubmission();
  };

  const handleCoverUrl = (event: FieldEvent): void => {
    setCoverUrl(event.currentTarget.value);
    clearSubmission();
  };

  const handleSignOut = async (): Promise<void> => {
    setSignOutError(undefined);
    try {
      await logout();
      navigate("/login");
    } catch {
      setSignOutError("Could not sign out. Try again.");
    }
  };

  return (
    <div id={style.settings}>
      <form id={style.profilePanel} action={updateProfile} method="post">
        <header id={style.panelHeader}>
          <h2>Profile</h2>
          <p>Your name, bio, links and images on your public profile.</p>
        </header>
        <div id={style.preview}>
          <img id={style.coverPreview} src={coverPreview()} alt="" />
          <img id={style.avatarPreview} src={avatarPreview()} alt="" />
        </div>
        <label>
          <span>Display name</span>
          <input
            type="text"
            name="displayName"
            maxLength={MAX_DISPLAY_NAME_LENGTH}
            value={displayName()}
            onInput={handleDisplayName}
            disabled={pending()}
            required
          />
        </label>
        <label>
          <span>Bio</span>
          <textarea
            name="bio"
            rows="3"
            maxLength={MAX_BIO_LENGTH}
            value={bio()}
            onInput={handleBio}
            disabled={pending()}
          />
          <span id={style.bioCount} aria-hidden="true">
            {bio().length}/{MAX_BIO_LENGTH}
          </span>
        </label>
        <label>
          <span>Website</span>
          <input
            type="text"
            inputmode="url"
            name="website"
            placeholder="https://example.com"
            maxLength={MAX_WEBSITE_LENGTH}
            value={website()}
            onInput={handleWebsite}
            disabled={pending()}
          />
          <small>
            A domain or a full URL. We add https:// when it is missing.
          </small>
        </label>
        <label>
          <span>Avatar URL</span>
          <input
            type="text"
            inputmode="url"
            name="avatarUrl"
            placeholder="/profile-picture.svg"
            maxLength={MAX_IMAGE_URL_LENGTH}
            value={avatarUrl()}
            onInput={handleAvatarUrl}
            disabled={pending()}
          />
          <small>A full URL or a path starting with /.</small>
        </label>
        <label>
          <span>Cover URL</span>
          <input
            type="text"
            inputmode="url"
            name="coverUrl"
            placeholder="/profile-cover.svg"
            maxLength={MAX_IMAGE_URL_LENGTH}
            value={coverUrl()}
            onInput={handleCoverUrl}
            disabled={pending()}
          />
          <small>A full URL or a path starting with /.</small>
        </label>
        <Show when={error() !== undefined}>
          <p id={style.formError} role="alert">
            {error()}
          </p>
        </Show>
        <Show when={succeeded()}>
          <p id={style.formSuccess} role="status">
            Profile updated.
          </p>
        </Show>
        <footer id={style.formActions}>
          <button id={style.saveButton} type="submit" disabled={pending()}>
            {pending() ? "Saving..." : "Save changes"}
          </button>
        </footer>
      </form>
      <section id={style.accountPanel}>
        <h2>Account</h2>
        <p>These details identify your account and cannot be changed here.</p>
        <dl id={style.accountDetails}>
          <div>
            <dt>Username</dt>
            <dd>@{props.profile.handle}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{props.profile.email}</dd>
          </div>
          <div>
            <dt>Joined</dt>
            <dd>{props.profile.joined}</dd>
          </div>
        </dl>
        <button id={style.signOutButton} type="button" onClick={handleSignOut}>
          Sign out
        </button>
        <Show when={signOutError() !== undefined}>
          <p id={style.signOutError} role="alert">
            {signOutError()}
          </p>
        </Show>
      </section>
    </div>
  );
}
