# bws-axi

## Repo identity (credential guard)

Every GitHub operation on this repo uses the **masculinecache** account only — never global personal credentials.

- `gh`/`gh-axi` calls: export `GH_CONFIG_DIR=$HOME/.config/gh-masculinecache` first; never rely on ambient gh config.
- The committed `.mise.toml` carries this rule for mise-driven shells: `GH_REPO=masculinecache/bws-axi`, `GH_CONFIG_DIR=$HOME/.config/gh-masculinecache`. If mise is not active, export them by hand.
- `git push` already works as masculinecache via the repo-local credential helper — do not alter it.
- On gh auth failure (403/wrong account): stop and report blocked; never retry with different credentials.

The five-layer repo-identity pattern (fleet reference) is documented in `/home/ubuntu/.agents/skills/masculinecache-repo-identity/SKILL.md`.

## Maintaining this file

Keep entries to knowledge useful to almost every future session. Prefer pointers to authoritative files over copying details. Update this section only when durable, project-intrinsic facts change.
